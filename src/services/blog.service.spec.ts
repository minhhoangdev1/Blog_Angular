import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Blog } from 'src/app/admin/Blog';
import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlogService],
    });
    service = TestBed.inject(BlogService);
    httpMock = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return blog records', () => {
    let blogRecords = [
      {
        id: 3,
        title: 'Mo',
        short_desc: 'Abjal khan',
        desc: 'Abjal khan9012114316',
        image: 'default.jpg',
        date_create: '2021-06-04',
      },
      {
        id: 4,
        title: 'Mo',
        short_desc: 'Abjal khan',
        desc: 'Abjal khan9012114316',
        image: 'default.jpg',
        date_create: '2021-06-04',
      },
    ];

    spyOn(httpMock, 'get').and.returnValue(of(blogRecords));

    let returnedBlogs: Blog[] = [];

    service.getAllBlogs().subscribe((response) => {
      returnedBlogs = response;
    });
    expect(httpMock.get).toHaveBeenCalled();
    expect(returnedBlogs).toEqual(blogRecords);
  });

  it('should insert a new Blog and return the inserted Blog record', () => {
    let blog: Blog = {
      id: 0,
      title: 'Mo',
      short_desc: 'Abjal khan',
      desc: 'Abjal khan9012114316',
      image: 'default.jpg',
      date_create: '2021-06-04',
    };
    spyOn(httpMock, 'post').and.returnValue(of(blog));

    let newInsertedBlog;
    service
      .saveUpdateBlog(0, blog)
      .subscribe((response) => (newInsertedBlog = response));

    expect(httpMock.post).toHaveBeenCalled();
    expect(newInsertedBlog).not.toBeNull();
  });

  it('should update the Blog and return the updated Blog', () => {
    let blog: Blog = {
      id: 2,
      title: 'Mo',
      short_desc: 'Abjal khan',
      desc: 'Abjal khan9012114316',
      image: 'default.jpg',
      date_create: '2021-06-04',
    };
    spyOn(httpMock, 'put').and.returnValue(of(blog));

    service.saveUpdateBlog(2, blog).subscribe((response) => {
      expect(httpMock.put).toHaveBeenCalled();
      expect(response).toEqual(blog);
    });
  });

  it('should delete a Blog from existing records', () => {
    spyOn(httpMock, 'delete').and.returnValue(of(true));

    service.deleteBlog(1).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(httpMock.delete).toHaveBeenCalled();
    });
  });
});
