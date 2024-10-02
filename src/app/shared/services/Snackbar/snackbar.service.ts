import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string, config?: MatSnackBarConfig) {
    const defaultConfig: MatSnackBarConfig = {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'end'     
    };

    const snackBarConfig: MatSnackBarConfig = { ...defaultConfig, ...config };

    this.snackBar.open(message, action, snackBarConfig);
  }

  showErrorMessage(errorMessage: string) {
    const action = 'Dismiss';
    const config: MatSnackBarConfig = {
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    };
    this.openSnackBar(errorMessage, action, config);
  }

  networkError() {
    this.showErrorMessage('Unable to connect to the server. Please check your internet connection.');
  }

  badRequestError(){
    this.showErrorMessage('Bad request error.');
  }

  unauthorizedError() {
    this.showErrorMessage('Invalid credentials. Please check your username and password.');
  }

  forbiddenError(){
    this.showErrorMessage('Forbidden error.');
  }

  resourceNotFoundError(){
    this.showErrorMessage('Resource not found error.');
  }

  internalServerError() {
    this.showErrorMessage('An internal server error occurred. Please try again later.');
  }


  fetchingError() {
    this.showErrorMessage('An error occurred while fetching information. Please try again.');
  }



  methodNotAllowedError() {
    this.showErrorMessage('Method not allowed for this resource.');
  }
  
  notAcceptableError() {
    this.showErrorMessage('The requested resource cannot produce the response format specified in the accept headers.');
  }
  
  paymentRequiredError() {
    this.showErrorMessage('Payment is required to access this resource. Please make the necessary payment.');
  }
  
  proxyAuthRequiredError() {
    this.showErrorMessage('Proxy authentication required. Please provide valid credentials.');
  }
  
  requestTimeoutError() {
    this.showErrorMessage('The server timed out waiting for the request.');
  }
  
  conflictError() {
    this.showErrorMessage('The request could not be completed due to a conflict with the current state of the resource.');
  }
  
  goneError() {
    this.showErrorMessage('The requested resource is no longer available and has been permanently removed.');
  }
  
  lengthRequiredError() {
    this.showErrorMessage('The request did not specify the length of its content, which is required.');
  }
  
  preconditionFailedError() {
    this.showErrorMessage('The server does not meet one of the preconditions specified by the client.');
  }
  
  payloadTooLargeError() {
    this.showErrorMessage('The request is larger than the server is willing or able to process.');
  }
  
  uriTooLongError() {
    this.showErrorMessage('The URI provided was too long for the server to process.');
  }
  
  unsupportedMediaTypeError() {
    this.showErrorMessage('The server does not support the media type transmitted in the request.');
  }
  
  rangeNotSatisfiableError() {
    this.showErrorMessage('The server cannot provide the requested range.');
  }
  
  expectationFailedError() {
    this.showErrorMessage('The expectation given in the request header could not be met.');
  }
  
  imATeapotError() {
    this.showErrorMessage('I am a teapot. This error is defined in RFC 2324 and is not meant to be taken seriously.');
  }
  
  misdirectedRequestError() {
    this.showErrorMessage('The server is not able to produce a response for this request.');
  }
  
  unprocessableEntityError() {
    this.showErrorMessage('The server understands the content type of the request entity but was unable to process the contained instructions.');
  }
  
  lockedError() {
    this.showErrorMessage('The requested resource is locked and may not be modified.');
  }
  
  failedDependencyError() {
    this.showErrorMessage('The method could not be performed on the resource because the requested action depended on another action.');
  }
  
  upgradeRequiredError() {
    this.showErrorMessage('The server requires the request to be secure.');
  }
  
  preconditionRequiredError() {
    this.showErrorMessage('The server requires the request to include a precondition.');
  }
  
  tooManyRequestsError() {
    this.showErrorMessage('The user has sent too many requests in a given amount of time.');
  }
  
  requestHeaderFieldsTooLargeError() {
    this.showErrorMessage('The server is unwilling to process the request because its header fields are too large.');
  }
  
  unavailableForLegalReasonsError() {
    this.showErrorMessage('The requested resource is not available due to legal reasons.');
  }
  
  notImplementedError() {
    this.showErrorMessage('The server does not support the functionality required to fulfill the request.');
  }
  
  badGatewayError() {
    this.showErrorMessage('The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed.');
  }
  
  serviceUnavailableError() {
    this.showErrorMessage('The server is currently unable to handle the request due to temporary overloading or maintenance of the server.');
  }
  
  gatewayTimeoutError() {
    this.showErrorMessage('The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server or some other auxiliary server it needed to access.');
  }
  
  httpVersionNotSupportedError() {
    this.showErrorMessage('The server does not support the HTTP protocol version used in the request.');
  }
  
  variantAlsoNegotiatesError() {
    this.showErrorMessage('The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.');
  }
  
  insufficientStorageError() {
    this.showErrorMessage('The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.');
  }
  
  loopDetectedError() {
    this.showErrorMessage('The server terminated an operation because it encountered an infinite loop while processing a request with "Depth: infinity".');
  }
  
  notExtendedError() {
    this.showErrorMessage('Further extensions to the request are required for the server to fulfill it.');
  }
  
  networkAuthRequiredError() {
    this.showErrorMessage('The client must authenticate itself to get the requested response. This status is similar to 401 (Unauthorized), but indicates that the client must authenticate itself to get the requested response.');
  }
  




  handleApiError(error: any) {
    switch (error.status) {
      case 0:
        this.networkError();
        break;
      case 400:
        this.badRequestError();
        break;
      case 401:
        this.unauthorizedError();
        break;
      case 402:
        this.paymentRequiredError();
        break;
      case 403:
        this.forbiddenError();
        break;
      case 404:
        this.resourceNotFoundError();
        break;
      case 405:
        this.methodNotAllowedError();
        break;
      case 406:
        this.notAcceptableError();
        break;
      case 407:
        this.proxyAuthRequiredError();
        break;
      case 408:
        this.requestTimeoutError();
        break;
      case 409:
        this.conflictError();
        break;
      case 410:
        this.goneError();
        break;
      case 411:
        this.lengthRequiredError();
        break;
      case 412:
        this.preconditionFailedError();
        break;
      case 413:
        this.payloadTooLargeError();
        break;
      case 414:
        this.uriTooLongError();
        break;
      case 415:
        this.unsupportedMediaTypeError();
        break;
      case 416:
        this.rangeNotSatisfiableError();
        break;
      case 417:
        this.expectationFailedError();
        break;
      case 418:
        this.imATeapotError();
        break;
      case 421:
        this.misdirectedRequestError();
        break;
      case 422:
        this.unprocessableEntityError();
        break;
      case 423:
        this.lockedError();
        break;
      case 424:
        this.failedDependencyError();
        break;
      case 426:
        this.upgradeRequiredError();
        break;
      case 428:
        this.preconditionRequiredError();
        break;
      case 429:
        this.tooManyRequestsError();
        break;
      case 431:
        this.requestHeaderFieldsTooLargeError();
        break;
      case 451:
        this.unavailableForLegalReasonsError();
        break;
      case 500:
        this.internalServerError();
        break;
      case 501:
        this.notImplementedError();
        break;
      case 502:
        this.badGatewayError();
        break;
      case 503:
        this.serviceUnavailableError();
        break;
      case 504:
        this.gatewayTimeoutError();
        break;
      case 505:
        this.httpVersionNotSupportedError();
        break;
      case 506:
        this.variantAlsoNegotiatesError();
        break;
      case 507:
        this.insufficientStorageError();
        break;
      case 508:
        this.loopDetectedError();
        break;
      case 510:
        this.notExtendedError();
        break;
      case 511:
        this.networkAuthRequiredError();
        break;
      default:
        this.defaultError();
        break;
    }
  }
  
  validationError(){
    this.showErrorMessage('Validation Error');
  }

  defaultError() {
    this.showErrorMessage('An error occurred. Please try again.');
  }

  insertSuccess() {
    const errorMessage = 'Added Successfully';
    const action = 'Dismiss';
    const config: MatSnackBarConfig = {
      verticalPosition: 'top', 
      horizontalPosition: 'end',
      duration:2000    
    };
    this.openSnackBar(errorMessage, action, config);
  }

  updateSuccess() {
    const errorMessage = 'Update Successfully';
    const action = 'Dismiss';
    const config: MatSnackBarConfig = {
      verticalPosition: 'top', 
      horizontalPosition: 'end',
      duration:2000  
    };
    this.openSnackBar(errorMessage, action, config);
  }

  DeleteSuccess() {
    const errorMessage = 'Delete Successfully';
    const action = 'Dismiss';
    const config: MatSnackBarConfig = {
      verticalPosition: 'top', 
      horizontalPosition: 'end',
      duration:2000  
    };
    this.openSnackBar(errorMessage, action, config);
  }


  ProcessSuccess() {
    const errorMessage = 'Process Successfully';
    const action = 'Dismiss';
    const config: MatSnackBarConfig = {
      verticalPosition: 'top', 
      horizontalPosition: 'end',
      duration:2000  
    };
    this.openSnackBar(errorMessage, action, config);
  }


  FileUploadSuccess() {
    const errorMessage = 'Process Successfully';
    const action = 'Dismiss';
    const config: MatSnackBarConfig = {
      verticalPosition: 'top', 
      horizontalPosition: 'end',
      duration:2000  
    };
    this.openSnackBar(errorMessage, action, config);
  }

}
