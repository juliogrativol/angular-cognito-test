import { Injectable } from "@angular/core";
import { User } from "../models/user";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

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
  constructor(private router: Router) { }

  public async passwordRecover(userInfo: User) {

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

  public async changePassword(oldPassword: string, newPassword: string, email: string): Promise<any> {
    const userLogg: any = await this.login({ email, password: oldPassword });

    localStorage.setItem("ACCESS_TOKEN", JSON.stringify(userLogg.signInUserSession));

    userLogg.changePassword(oldPassword, newPassword, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return err.message;
      }
      return result;
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
        userInfo.email,
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
        Username: userInfo.email,
        Pool: userPool,
      };

      cognitoUser = new CognitoUser(userData);

      cognitoUser.confirmRegistration(userInfo.codigo, true, (
        err,
        result
      ) => {
        if (err) {
          alert(err.message);
          reject(err.message);
        } else {
          resolve();
          console.log("Resolvido =>", result);
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
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          localStorage.setItem('sessionUserAttributes', JSON.stringify({ userAttributes, cognUser: cognitoUser }));
          resolve("newPasswordRequired");
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  public completeNewPasswordChallenge(newPassword: any) {
    const { userAttributes, cognUser } = JSON.parse(localStorage.getItem('sessionUserAttributes'));
    const pool = new CognitoUserPool(poolData);


    const userData = {
      Username: userAttributes.email,
      Pool: pool,
    };

    const user = new CognitoUser(userData);

    user['Session'] = cognUser['Session'];

    user.completeNewPasswordChallenge(newPassword, {}, {
      onSuccess: (session: any) => {
        alert('Nova senha criada com sucesso');
        this.router.navigate(['/login']);
      },
      onFailure: (err: any) => alert(err)
    });
  }

  public isLoggedIn() {
    return localStorage.getItem("ACCESS_TOKEN") !== null;
  }

  public logout() {
    localStorage.removeItem("ACCESS_TOKEN");
  }
}
