import { HttpClient } from '@angular/common/http';
import { Injectable,InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Blog } from 'src/app/admin/Blog';

export const BLOG_SERVICE = new InjectionToken<BlogService>(
  'BlogService'
);

@Injectable()
export class BlogService {
  private configUrl = 'http://localhost:3000/blogs';
  //number blog to get the blog
  private limit=5;
  constructor(private httpService: HttpClient) { }
  // Service method to get all Blog records
  getAllBlogs(): Observable<Blog[]> {
    return this.httpService.get<Blog[]>(this.configUrl);
  }

  //get blog detail
  getDetailBlog(id: any): Observable<Blog[]> {
    return this.httpService.get<Blog[]>(this.configUrl+ '/'+id);
  }

  //get 5 blog
  getNumberBlogs(): Observable<Blog[]> {
    return this.httpService.get<Blog[]>(this.configUrl+'?_limit='+this.limit);
  }

  //  Service method to insert/update the Blogs records
  saveUpdateBlog(id: number, Blog: Blog): Observable<Blog> {
    if (id > 0) return this.updateBlog(id, Blog);
    else return this.insertBlog(Blog);
  }

  //  To insert a new Blog
  private insertBlog(Blog: Blog) {
    return this.httpService.post<Blog>(this.configUrl, Blog);
  }

  //  To update the existing Blog
  private updateBlog(id: number, Blog: Blog) {
    return this.httpService.put<Blog>(this.configUrl + '/' + id, Blog);
  }

  //  Service method to delete the Blogs record
  deleteBlog(id: number) {
    return this.httpService.delete(this.configUrl + '/' + id);
  }
  
  //search blog 
  searchBlog(q: any): Observable<Blog[]> {
    return this.httpService.get<Blog[]>(this.configUrl+ '?q='+q);
  }
}
