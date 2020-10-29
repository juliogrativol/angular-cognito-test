import { Injectable } from '@angular/core';
import { User } from './user';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_JyYijsz4A",
  ClientId: "7fkr0vos5eral5mham0irknim2",
};

const userPool = new CognitoUserPool(poolData);
var cognitoUser = null

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public async passwordRecover(userInfo: User) {

    console.log('userInfo', userInfo);

    var userData = {
      Username: userInfo.email,
      Pool: userPool
    }

    cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: function (result) {
          console.log('call result: ' + result);
          resolve(result)
        },
        onFailure: function (err) {
          reject(err);
        },
        inputVerificationCode() {
          resolve("habilitar campos de verificação")
        }
      });
    });
  }

  public async confirmRecoverPassword(userInfo: User) {

    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(userInfo.codigo, userInfo.newPassword, {
        onFailure(err) {
          reject(err);
        },
        onSuccess(result) {
          resolve(result);
        },
      });
    });
  }

  public async signUp(userInfo: User) {

    return new Promise((resolve, reject) => {

      var attributeList = [];

      attributeList.push(new CognitoUserAttribute({ Name: "email", Value: userInfo.email }));

      userPool.signUp(userInfo.userName, userInfo.password, attributeList, null, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  //
  public async resendConfirmationCode(userName: string): Promise<any> {
    const userData = {
      Username: userName,
      Pool: userPool
    };

    cognitoUser = new CognitoUser(userData);

    return new Promise((reject, resolve) => {
      cognitoUser.resendConfirmationCode((result, err) => {
        if (err) { reject(err); }
        resolve(result);
      });
    });
  }

  public async verifyCode(userInfo: User) {
    return new Promise((resolve, reject) => {

      var userData = {
        Username: userInfo.userName,
        Pool: userPool
      }

      cognitoUser = new CognitoUser(userData);

      cognitoUser.confirmRegistration(userInfo.codigo, true, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async login(userInfo: User) {

    const userPool = new CognitoUserPool(poolData);

    var userName = userInfo.email;
    var password = userInfo.password;

    var authenticationDetails = new AuthenticationDetails({
      Username: userName,
      Password: password
    });

    var userData = {
      Username: userName,
      Pool: userPool
    }

    var cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          console.log('sucesso', result)
          localStorage.setItem('ACCESS_TOKEN', this.result);
          resolve(result)
        },
        newPasswordRequired: function (result) {
          console.log('newPasswordRequired')
          resolve("newPasswordRequired")
        },
        onFailure: (function (err) {
          reject(err)
        })
      })
    })
  }

  public isLoggedIn() {
    return localStorage.getItem('ACCESS_TOKEN') !== null;

  }

  public logout() {
    localStorage.removeItem('ACCESS_TOKEN');
  }
}