import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { BlogService, BLOG_SERVICE } from 'src/services/blog.service';
import { Blog } from './Blog';
import { AdminComponent } from './admin.component';

let translations: any = { CARDS_TITLE: 'This is a test' };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('AdminComponent', () => {
  let component: AdminComponent;
  let service: BlogService;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader,
            deps: [HttpClient],
          },
        }),
      ],
      providers: [{ provide: BLOG_SERVICE, useClass: BlogService }],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(BLOG_SERVICE);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create a form with 6 controls', () => {
    expect(component.form.contains('title')).toBeTruthy();
    expect(component.form.contains('short_desc')).toBeTruthy();
    expect(component.form.contains('desc')).toBeTruthy();
    expect(component.form.contains('image')).toBeTruthy();
    expect(component.form.contains('date_create')).toBeTruthy();
  });

  it('should create the controls as required', () => {
    let title = component.form.get('title');
    let short_desc = component.form.get('short_desc');
    let desc = component.form.get('desc');
    let image = component.form.get('image');
    let date_create = component.form.get('date_create');

    title?.setValue('');
    short_desc?.setValue('');
    desc?.setValue('');
    image?.setValue('');
    date_create?.setValue('');

    expect(component.isValidControl('title')).toBeFalsy();
    expect(component.isValidControl('short_desc')).toBeFalsy();
    expect(component.isValidControl('desc')).toBeFalsy();
    expect(component.isValidControl('image')).toBeFalsy();
    expect(component.isValidControl('date_create')).toBeFalsy();
  });

  it('should fill the values inside form controls', () => {
    let blogObj = {
      title: 'Mo',
      short_desc: 'Abjal',
      desc: 'Abjal9012114316',
      image: 'moh@gmail.com',
      date_create: '2021-06-04',
      id: 4,
    };
    component.fillBlogDetailsIntoForm(blogObj);

    expect(component.form.value.title).toEqual(blogObj.title);
    expect(component.form.value.short_desc).toEqual(blogObj.short_desc);
    expect(component.form.value.desc).toEqual(blogObj.desc);
    expect(component.form.value.image).toEqual(blogObj.image);
    expect(component.form.value.date_create).toEqual(blogObj.date_create);
  });

  it('should not fill the values inside form controls when we pass an empty object', () => {
    component.fillBlogDetailsIntoForm();

    expect(component.form.value.title).toBe('');
    expect(component.form.value.short_desc).toBe('');
    expect(component.form.value.desc).toBe('');
    expect(component.form.value.image).toBe('');
    expect(component.form.value.date_create).toBe('');
  });

  it('should get the Blogs and push into existing records', () => {
    let blogs: Blog[] = [
      {
        id: 1,
        title: 'Mo',
        short_desc: 'Abjal',
        desc: 'Abjal9012114316',
        image: 'default.jpg',
        date_create: '08/01/1997',
      },
      {
        id: 2,
        title: 'Mo',
        short_desc: 'Abjal',
        desc: 'Abjal901214316',
        image: 'default.jpg',
        date_create: '08/01/1997',
      },
    ];
    spyOn(service, 'getAllBlogs').and.returnValue(of(blogs));

    component.ngOnInit();

    expect(service.getAllBlogs).toHaveBeenCalled();
    expect(component.blogRecords).toEqual(blogs);
  });

  it('should insert the new Blog records into exixsting Blog records', () => {
    let blog: Blog = {
      id: 0,
      title: 'Mo',
      short_desc: 'Abjal',
      desc: 'Abjal9012114316',
      image: 'default.jpg',
      date_create: '08/01/1997'
    };

    spyOn(service, 'saveUpdateBlog').and.returnValue(of(blog));
    component.fillBlogDetailsIntoForm(blog);
    component.saveUpdateBlog();

    expect(service.saveUpdateBlog).toHaveBeenCalled();
    expect(component.blogRecords.indexOf(blog)).toBeGreaterThan(-1);
  });

  it('should not insert the new Blog when we does not pass the Blog', () => {
    let Blog: Blog = {
      id: 0,
      title: 'Mo',
      short_desc: 'Abjal',
      desc: '9012114316',
      image: 'default.jpg',
      date_create: '08/01/1997'
    };

    spyOn(service, 'saveUpdateBlog').and.returnValue(of(Blog));
    component.saveUpdateBlog();

    expect(service.saveUpdateBlog).not.toHaveBeenCalled();
    expect(component.blogRecords.length).toBe(0);
  });

  it('should update the existing Blog record', () => {
    component.blogRecords = [
      {
        id: 1,
        title: 'Mo',
        short_desc: 'Abjal',
        desc: '9012114316',
        image: 'default.jpg',
        date_create: '08/01/1997',
      },
      {
        id: 2,
        title: 'Mo',
        short_desc: 'Abjal',
        desc: 'Abjal901214316',
        image: 'default.jpg',
        date_create: '08/01/1997',
      },
    ];
    let BlogToUpdate: Blog = {
      id: 2,
      title: 'Mo',
      short_desc: 'Abjal',
      desc: 'Abjal901214316',
      image: 'default.jpg',
      date_create: '08/01/1997'
    };

    spyOn(service, 'saveUpdateBlog').and.returnValue(of(BlogToUpdate));

    component.fillBlogDetailsIntoForm(BlogToUpdate);

    component.saveUpdateBlog();

    let currentBlog = component.blogRecords.find(
      (Blog) => Blog.id == BlogToUpdate.id
    );

    if (!currentBlog) return;

    expect(service.saveUpdateBlog).toHaveBeenCalled();
    expect(currentBlog).toEqual(BlogToUpdate);
  });

  it('should delete the Blog record from existing Blog records', () => {
    component.blogRecords = [
      {
        title: 'Mo',
        short_desc: 'Abjal khan bar',
        desc: '9012114316',
        image: 'mh@gmail.com',
        date_create: '2021-06-04',
        id: 3,
      },
      {
        title: 'Noorul',
        short_desc: 'Hassan',
        desc: '9012114318',
        image: 'mo@gail.com',
        date_create: '2021-06-12',
        id: 4,
      },
    ];
    let BlogToDelete = {
      title: 'Noorul',
      short_desc: 'Hassan',
      desc: '9012114318',
      image: 'mo@gail.com',
      date_create: '2021-06-12',
      id: 4,
    };
    spyOn(service, 'deleteBlog').and.returnValue(of(true));

    component.deleteBlog(BlogToDelete);

    expect(service.deleteBlog).toHaveBeenCalled();
    expect(component.blogRecords.indexOf(BlogToDelete)).toBe(-1);
  });

  it('should not delete the Blog if we pass an invalid Blog', () => {
    component.blogRecords = [
      {
        title: 'Mo',
        short_desc: 'Abjal khan bar',
        desc: '9012114316',
        image: 'mh@gmail.com',
        date_create: '2021-06-04',
        id: 3,
      },
      {
        title: 'Noorul',
        short_desc: 'Hassan',
        desc: '9012114318',
        image: 'mo@gail.com',
        date_create: '2021-06-12',
        id: 0,
      },
    ];
    let BlogToDelete = {
      title: 'Noorul',
      short_desc: 'Hassan',
      desc: '9012114318',
      image: 'mo@gail.com',
      date_create: '2021-06-12',
      id: 0,
    };
    spyOn(service, 'deleteBlog').and.returnValue(of(true));

    component.deleteBlog(BlogToDelete);

    expect(service.deleteBlog).not.toHaveBeenCalled();
    expect(component.blogRecords.indexOf(BlogToDelete)).toBe(-1);
  });
});
