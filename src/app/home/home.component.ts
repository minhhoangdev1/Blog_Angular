import { Component,Inject, OnInit } from '@angular/core';
import { Subscription,Observable  } from 'rxjs';
import { BlogService, BLOG_SERVICE } from 'src/services/blog.service';
import { Blog } from '../admin/Blog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private subscription = new Subscription();
  public blogRecords: Blog[] = [];
  
  page: number = 1;
  count: number = 0;
  tableSize: number = 3;
  public tableSizes: any = [3, 6, 9, 12];

  constructor(@Inject(BLOG_SERVICE) private blogService: BlogService) { }

  ngOnInit(): void {
    this.getAllBlog();
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

  onTableDataChange(event: any) {
    this.page = event;
    this.getAllBlog();
  }
  onTableSizeChange(event: any): void {
    console.log(event.target.value)
    this.tableSize = event.target.value;
    this.page = 1;
    this.getAllBlog();
  }

}
