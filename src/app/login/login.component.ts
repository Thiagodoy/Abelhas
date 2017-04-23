import { ParseService } from './../service/parse.service';
import { UserWeb } from './../models/user-web';
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  selectedValue: boolean = false;
  cpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  cnpj = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];

  constructor(private fb: FormBuilder, private parseService: ParseService) { }

  ngOnInit() {    
    this.createForm();    
  }
  createForm() {
    this.formLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  change(event) {
    this.selectedValue = event.checked;
    this.formLogin.get('username').setValue('');
    this.formLogin.get('password').setValue('');
  }

  login() {
    let user = new UserWeb();
    let username:string = this.formLogin.get('username').value;
    username = username.replace(/[^0-9]/gi,'');
    user.setUsername(username);
    user.setPassword(this.formLogin.get('password').value);
    this.parseService.login(user);    
  }

}
