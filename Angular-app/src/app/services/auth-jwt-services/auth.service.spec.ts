import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment'

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule],
      providers: [ AuthService]
    });
    service = TestBed.get(AuthService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach( ()=> {
    httpMock.verify();
  });

  it('should return a token if login credentials are correct', () => {
    const response = {
      "token":"this is the token"
    };

    service.login('email', 'password').subscribe( response =>{
      expect(response).toEqual(response)
    });
    
    const request = httpMock.expectOne(environment.apiUrl+'/api/auth/signin')
    expect(request.request.method).toBe('POST')
    request.flush(response)

  });


  it('should return httpResponseError if login credentials are incorrect', () => {
    const response = {
      "error":"missing email"
    };

    service.login('a wrong email', 'password').subscribe( response =>{
      expect(response).toEqual(response)
    });
    
  
    const request = httpMock.expectOne(environment.apiUrl+'/api/auth/signin')
    expect(request.request.method).toBe('POST')
    request.flush(response)

  });


});
