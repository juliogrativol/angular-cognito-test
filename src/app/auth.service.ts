import { Injectable } from "@angular/core";
import { User } from "./user";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { Observable } from 'rxjs';

const poolData = {
  UserPoolId: "us-east-1_TmptgyCB3",
  ClientId: "247ccg28bsvjpp09nanbi4sano",
};

const userPool = new CognitoUserPool(poolData);
var cognitoUser = null;

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor() { }

  public async passwordRecover(userInfo: User) {
    console.log("userInfo", userInfo);

    var userData = {
      Username: userInfo.email,
      Pool: userPool,
    };

    cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: (result) => {
          console.log("call result: " + result);
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
        inputVerificationCode() {
          resolve("habilitar campos de verificação");
        },
      });
    });
  }

  async changePassword(oldPassword: string, newPassword: string, email: string): Promise<any> {
    const userLogg: any = await this.login({ email, password: oldPassword });

    localStorage.setItem("ACCESS_TOKEN", JSON.stringify(userLogg.signInUserSession));

    userLogg.changePassword(oldPassword, newPassword, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      console.log('call result: ' + result);
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

      attributeList.push(
        new CognitoUserAttribute({ Name: "email", Value: userInfo.email })
      );
      userPool.signUp(
        userInfo.userName,
        userInfo.password,
        attributeList,
        null,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
  //
  public async resendConfirmationCode(userName: string): Promise<any> {
    const userData = {
      Username: userName,
      Pool: userPool,
    };

    cognitoUser = new CognitoUser(userData);

    return new Promise((reject, resolve) => {
      cognitoUser.resendConfirmationCode((result, err) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  public async verifyCode(userInfo: User) {
    return new Promise((resolve, reject) => {
      var userData = {
        Username: userInfo.userName,
        Pool: userPool,
      };

      cognitoUser = new CognitoUser(userData);

      cognitoUser.confirmRegistration(userInfo.codigo, true, function (
        err,
        result
      ) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async login(userInfo: User) {
    var userPool = new CognitoUserPool(poolData);

    var userName = userInfo.email;
    var password = userInfo.password;

    var authenticationDetails = new AuthenticationDetails({
      Username: userName,
      Password: password,
    });

    var userData = {
      Username: userName,
      Pool: userPool,
    };

    var cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: any) => {
          localStorage.setItem("ACCESS_TOKEN", JSON.stringify(result));
          resolve(cognitoUser);
        },
        newPasswordRequired: (result) => {
          resolve("newPasswordRequired");
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  public isLoggedIn() {
    return localStorage.getItem("ACCESS_TOKEN") !== null;
  }

  public logout() {
    localStorage.removeItem("ACCESS_TOKEN");
  }
}
