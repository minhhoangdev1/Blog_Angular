import { Component,Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription,Observable  } from 'rxjs';
import { finalize } from "rxjs/operators";
import { BlogService, BLOG_SERVICE } from 'src/services/blog.service';
import { Blog } from './Blog';  
import { AngularFireStorage } from "@angular/fire/compat/storage";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { isEmpty } from '@firebase/util';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public Editor = ClassicEditor;

  page: number = 1;
  count: number = 0;
  tableSize: number = 5;

  keyword: any ;

  imgUrl:string="/assets/images/default.jpg";
  imgToUpload: File | any = null;
  title = "cloudsStorage";
  downloadURL: Observable<string>|any;
  public imageUpdate='';

  public blogRecords: Blog[] = [];
  private currentBlogId: number = 0;
  private subscription = new Subscription();
  //  Preparing Reactive form group object
  public form = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    short_desc: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    desc: new FormControl('', [
      Validators.required,
      Validators.maxLength(500),
    ]),
    image: new FormControl('', [
      Validators.maxLength(5000),
    ]),
    date_create: new FormControl('', [Validators.required]),
  });

  constructor(@Inject(BLOG_SERVICE) private blogService: BlogService, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.getAllBlog();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getAllBlog();
  }
  
  //To search blog
  handleSearch() {
    this.subscription =this.blogService.searchBlog(this.keyword).subscribe(data => {
      this.blogRecords = data.filter(item => {
        return (
          item.title.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1
        );
      });
    });
  }

  //change image when clicking on image
  handleImageChange(event: any) {
    this.imgToUpload=event.target.files[0];
    var reader = new FileReader();
    reader.onload = (event:any) =>{
      this.imgUrl=event.target.result;
    }
    reader.readAsDataURL(this.imgToUpload);
  }
  //  To get all blog
  getAllBlog() {
    this.subscription = this.blogService
      .getAllBlogs()
      .subscribe((response: Blog[]) => {
        this.blogRecords = response;
        this.subscription.unsubscribe();
      });
  }

  // To insert/update blog
  saveUpdateBlog() {
    if (this.form.value.title=='' || this.form.value.desc=='' || this.form.value.short_desc==''|| this.form.value.date_create=='') {
      alert('Hãy điền tất cả các thông tin!!');
    }
    else{
      //update
      if(this.imageUpdate!=''){
        //no upload image
        if(this.imgToUpload==null){
          this.form.value.image = this.imageUpdate;
          this.insertUpdate();
        }
        //have upload image
        else{
          this.deleteImageInFirebase(this.imageUpdate);
          this.saveImageFirebase();
        }
        this.imageUpdate='';
      }
      //inset
      else {
        this.saveImageFirebase();
        this.imgToUpload=null;
      }
    }
  }

  //function insert and update
  insertUpdate(){
     //save db.json
     this.blogService
     .saveUpdateBlog(this.currentBlogId, this.form.value)
     .subscribe((respone) => {
       if (respone && this.currentBlogId <= 0) {
         this.blogRecords.push(respone);
       } else {
         let currentBlog = this.blogRecords[0];
         for (
           let loopIndex = 0;
           loopIndex < this.blogRecords.length;
           loopIndex++
         ) {
           if (this.blogRecords[loopIndex].id == this.currentBlogId) {
             currentBlog = this.blogRecords[loopIndex];
             this.blogRecords[loopIndex] = respone;
             break;
           }
         }
       }

       //Reseting the Blogs form
       this.resetBlogForm();
     });
  }

  //function save image in firebase
  saveImageFirebase(){
    //upload image firebase
    var date = Date.now();
    const filePath = `RoomsImages/${date}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${date}`, this.imgToUpload);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.form.value.image=url;
            }
            //save or update
            this.insertUpdate()
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  //  method to fill the Blog details into Blog form
  fillBlogDetailsIntoForm(blog?: Blog) {
    if (!blog) return;
    this.imgUrl=blog.image;
    //  Setting the Blog details into Blog form
    this.form.setValue({
      title: blog.title,
      short_desc: blog.short_desc,
      desc: blog.desc,
      date_create: blog.date_create,
      image: '',
    });
   this.imageUpdate=blog.image;

    //  Storing the Blog id for future purpose
    //  while updating the Blog
    this.currentBlogId = blog.id;
  }
  //  method to delete the Blog
  deleteBlog(Blog: Blog) {
    if (Blog.id <= 0) return null;
    var filepath=Blog.image;
    this.blogService
      .deleteBlog(Blog.id)
      .subscribe((response: any) => {
        let index = this.blogRecords.indexOf(Blog);
        this.blogRecords.splice(index, 1);
      });

     this.deleteImageInFirebase(filepath);
   
  }

  //delete image in Firebase
  deleteImageInFirebase(filepath){
    //delete image in firebase
    return this.storage.storage.refFromURL(filepath).delete();
  }

  //Loading indicator

  //  Method to detect weather a control is valid or not
  isValidControl(controlName: string) {
    let control = this.getControl(controlName);
    return control && control.invalid && control.touched;
  }

  //  Private method to get perticular control object
  private getControl(controlName: string) {
    return this.form.get(controlName);
  }

  //  Method to reset the forms
  public resetBlogForm() {
    this.currentBlogId = 0;
    this.form.reset();
    this.form.value.title=='' 
    this.form.value.desc=='' 
    this.form.value.short_desc==''
    this.form.value.date_create==''
    this.imgUrl="/assets/images/default.jpg";
  }


}
