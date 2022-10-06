import { Component,Inject, OnInit } from '@angular/core';
import { Subscription  } from 'rxjs';
import { BlogService, BLOG_SERVICE } from 'src/services/blog.service';
import { Blog } from '../admin/Blog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detailblog',
  templateUrl: './detailblog.component.html',
  styleUrls: ['./detailblog.component.css']
})
export class DetailblogComponent implements OnInit {

  private subscription = new Subscription();
  private blogs = new Subscription();
  public blogDetail: any;
  id!: string;

  public blogRecords: Blog[] = [];

  constructor(@Inject(BLOG_SERVICE) private blogService: BlogService,private router: ActivatedRoute) { }

  ngOnInit(): void {
    //get id in http
    this.id=this.router.snapshot.paramMap.get('id') as string;
    this.getDetailBlog();
    this.getNumberBlogs();
  }

  onSubmit(blog){
    this.id=blog.id;
    this.getDetailBlog();
  }

   //To get all blog
  getDetailBlog() {
    this.subscription = this.blogService
      .getDetailBlog(this.id)
      .subscribe((response: Blog[]) => {
        this.blogDetail = response;
        this.subscription.unsubscribe();
      });
  }
  //  To get numberBlogs
  getNumberBlogs() {
    this.blogs = this.blogService
      .getNumberBlogs()
      .subscribe((response: Blog[]) => {
        this.blogRecords = response;
        this.blogs.unsubscribe();
      });
  }

}
