import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  
  constructor(private toastr: ToastrService) {}


  showSuccessToast(message: string, title: string = 'Success') {
    const defaultOptions: Partial<IndividualConfig> = {
      positionClass: 'toast-top-right', 
      timeOut: 5000, 
      extendedTimeOut: 1000, 
      progressBar: true, 
      enableHtml: false, 
      closeButton: true, 
      tapToDismiss: true, 
      disableTimeOut: false, 
      toastClass: 'ngx-toastr', 
      titleClass: '', 
      messageClass: '', 
      easing: 'ease-in-out', 
      easeTime: 300, 
      onActivateTick: false 
    };
  
    const config: Partial<IndividualConfig> = { ...defaultOptions };
  
    this.toastr.success(message, title, config);
  }
  


  showErrorToast(message: string, title: string = 'Error') {
    const defaultOptions: Partial<IndividualConfig> = {
      positionClass: 'toast-top-right',
      timeOut: 5000,
      extendedTimeOut: 1000,
      progressBar: true,
      enableHtml: false,
      closeButton: true,
      tapToDismiss: true,
      disableTimeOut: false,
      toastClass: 'ngx-toastr',
      titleClass: '',
      messageClass: '',
      easing: 'ease-in-out',
      easeTime: 300,
      onActivateTick: false
    };
  
    const config: Partial<IndividualConfig> = { ...defaultOptions };
  
    this.toastr.error(message, title, config);
  }

  

  showWarningToast(message: string, title: string = 'Warning') {
    const defaultOptions: Partial<IndividualConfig> = {
      positionClass: 'toast-top-right',
      timeOut: 5000,
      extendedTimeOut: 1000,
      progressBar: true,
      enableHtml: false,
      closeButton: true,
      tapToDismiss: true,
      disableTimeOut: false,
      toastClass: 'ngx-toastr',
      titleClass: '',
      messageClass: '',
      easing: 'ease-in-out',
      easeTime: 300,
      onActivateTick: false
    };
  
    const config: Partial<IndividualConfig> = { ...defaultOptions };
  
    this.toastr.warning(message, title, config);
  }
  
  

  

  showToast(message: string, title: string, type: string, options: Partial<IndividualConfig> = {}) {
    const defaultOptions: Partial<IndividualConfig> = {
      positionClass: 'toast-top-right', 
      timeOut: 5000, 
      extendedTimeOut: 1000, 
      progressBar: true, 
      enableHtml: false, 
      closeButton: true, 
      tapToDismiss: true, 
      disableTimeOut: false, 
      toastClass: 'ngx-toastr', 
      titleClass: '', 
      messageClass: '', 
      easing: 'ease-in-out', 
      easeTime: 300, 
      onActivateTick: false 
    };

    const config: Partial<IndividualConfig> = { ...defaultOptions, ...options };

    switch (type) {
      case 'success':
        this.toastr.success(message, title, config);
        break;
      case 'error':
        this.toastr.error(message, title, config);
        break;
      case 'warning':
        this.toastr.warning(message, title, config);
        break;
      case 'info':
        this.toastr.info(message, title, config);
        break;
    }
  }






  networkError() {
    this.showToast('Unable to connect to the server. Please check your internet connection.','Network Error', 'error');
  }
  
  badRequestError(){
    this.showToast('Bad request error.', 'Bad Request', 'error');
  }
  
  unauthorizedError() {
    this.showToast('Invalid credentials. Please check your username and password.', 'Unauthorized', 'error');
  }
  
  forbiddenError(){
    this.showToast('Forbidden error.', 'Forbidden', 'error');
  }
  
  resourceNotFoundError(){
    this.showToast('Resource not found error.', 'Not Found', 'error');
  }
  
  internalServerError() {
    this.showToast('An internal server error occurred. Please try again later.', 'Internal Server Error', 'error');
  }
  
  methodNotAllowedError() {
    this.showToast('Method not allowed for this resource.', 'Method Not Allowed', 'error');
  }
  
  notAcceptableError() {
    this.showToast('The requested resource cannot produce the response format specified in the accept headers.', 'Not Acceptable', 'error');
  }
  
  paymentRequiredError() {
    this.showToast('Payment is required to access this resource. Please make the necessary payment.', 'Payment Required', 'error');
  }
  
  proxyAuthRequiredError() {
    this.showToast('Proxy authentication required. Please provide valid credentials.', 'Proxy Authentication Required', 'error');
  }
  
  requestTimeoutError() {
    this.showToast('The server timed out waiting for the request.', 'Request Timeout', 'error');
  }
  
  conflictError() {
    this.showToast('The request could not be completed due to a conflict with the current state of the resource.', 'Conflict', 'error');
  }
  
  goneError() {
    this.showToast('The requested resource is no longer available and has been permanently removed.', 'Gone', 'error');
  }
  
  lengthRequiredError() {
    this.showToast('The request did not specify the length of its content, which is required.', 'Length Required', 'error');
  }
  
  preconditionFailedError() {
    this.showToast('The server does not meet one of the preconditions specified by the client.', 'Precondition Failed', 'error');
  }
  
  payloadTooLargeError() {
    this.showToast('The request is larger than the server is willing or able to process.', 'Payload Too Large', 'error');
  }
  
  uriTooLongError() {
    this.showToast('The URI provided was too long for the server to process.', 'URI Too Long', 'error');
  }
  
  unsupportedMediaTypeError() {
    this.showToast('The server does not support the media type transmitted in the request.', 'Unsupported Media Type', 'error');
  }
  
  rangeNotSatisfiableError() {
    this.showToast('The server cannot provide the requested range.', 'Range Not Satisfiable', 'error');
  }
  
  expectationFailedError() {
    this.showToast('The expectation given in the request header could not be met.', 'Expectation Failed', 'error');
  }
  
  imATeapotError() {
    this.showToast('I am a teapot. This error is defined in RFC 2324 and is not meant to be taken seriously.', 'I\'m a teapot', 'error');
  }
  
  misdirectedRequestError() {
    this.showToast('The server is not able to produce a response for this request.', 'Misdirected Request', 'error');
  }
  
  unprocessableEntityError() {
    this.showToast('The server understands the content type of the request entity but was unable to process the contained instructions.', 'Unprocessable Entity', 'error');
  }
  
  lockedError() {
    this.showToast('The requested resource is locked and may not be modified.', 'Locked', 'error');
  }
  
  failedDependencyError() {
    this.showToast('The method could not be performed on the resource because the requested action depended on another action.', 'Failed Dependency', 'error');
  }
  
  upgradeRequiredError() {
    this.showToast('The server requires the request to be secure.', 'Upgrade Required', 'error');
  }
  
  preconditionRequiredError() {
    this.showToast('The server requires the request to include a precondition.', 'Precondition Required', 'error');
  }
  
  tooManyRequestsError() {
    this.showToast('The user has sent too many requests in a given amount of time.', 'Too Many Requests', 'error');
  }
  
  requestHeaderFieldsTooLargeError() {
    this.showToast('The server is unwilling to process the request because its header fields are too large.', 'Request Header Fields Too Large', 'error');
  }
  
  unavailableForLegalReasonsError() {
    this.showToast('The requested resource is not available due to legal reasons.', 'Unavailable For Legal Reasons', 'error');
  }
  
  notImplementedError() {
    this.showToast('The server does not support the functionality required to fulfill the request.', 'Not Implemented', 'error');
  }
  
  badGatewayError() {
    this.showToast('The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed.', 'Bad Gateway', 'error');
  }
  
  serviceUnavailableError() {
    this.showToast('The server is currently unable to handle the request due to temporary overloading or maintenance of the server.', 'Service Unavailable', 'error');
  }
  
  gatewayTimeoutError() {
    this.showToast('The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server or some other auxiliary server it needed to access.', 'Gateway Timeout', 'error');
  }
  
  httpVersionNotSupportedError() {
    this.showToast('The server does not support the HTTP protocol version used in the request.', 'HTTP Version Not Supported', 'error');
  }
  
  variantAlsoNegotiatesError() {
    this.showToast('The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.', 'Variant Also Negotiates', 'error');
  }
  
  insufficientStorageError() {
    this.showToast('The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.', 'Insufficient Storage', 'error');
  }
  
  loopDetectedError() {
    this.showToast('The server terminated an operation because it encountered an infinite loop while processing a request with "Depth: infinity".', 'Loop Detected', 'error');
  }
  
  notExtendedError() {
    this.showToast('Further extensions to the request are required for the server to fulfill it.', 'Not Extended', 'error');
  }
  
  networkAuthRequiredError() {
    this.showToast('The client must authenticate itself to get the requested response. This status is similar to 401 (Unauthorized), but indicates that the client must authenticate itself to get the requested response.', 'Network Authentication Required', 'error');
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



  fetchingError() {
    this.showToast('An error occurred while fetching information. Please try again.', 'Fetching Error', 'error');
  }

  validationError() {
    this.showToast('Validation Error', 'Validation Error', 'error');
  }

  defaultError() {
    this.showToast('An error occurred. Please try again.', 'Error', 'error');
  }

  insertSuccess() {
    const errorMessage = 'Added Successfully';
    const action = 'Dismiss';
    const config: Partial<IndividualConfig> = {
      positionClass: 'toast-top-right',
      timeOut: 2000,
      progressBar: true,
      closeButton: false,
    };
    this.showToast(errorMessage, action, 'success', config);
  }

  updateSuccess() {
    const errorMessage = 'Update Successfully';
    const action = 'Dismiss';
    const config: Partial<IndividualConfig> = {
      positionClass: 'toast-top-right',
      timeOut: 2000,
      progressBar: true,
      closeButton: false,
    };
    this.showToast(errorMessage, action, 'success', config);
  }

  DeleteSuccess() {
    const errorMessage = 'Delete Successfully';
    const action = 'Dismiss';
    const config: Partial<IndividualConfig> = {
      positionClass: 'toast-top-right',
      timeOut: 2000,
      progressBar: true,
      closeButton: false,
    };
    this.showToast(errorMessage, action, 'success', config);
  }

  ProcessSuccess() {
    const errorMessage = 'Process Successfully';
    const action = 'Dismiss';
    const config: Partial<IndividualConfig> = {
      positionClass: 'toast-top-right',
      timeOut: 2000,
      progressBar: true,
      closeButton: false,
    };
    this.showToast(errorMessage, action, 'success', config);
  }

  FileUploadSuccess() {
    const errorMessage = 'File Upload Successfully';
    const action = 'Dismiss';
    const config: Partial<IndividualConfig> = {
      positionClass: 'toast-top-right',
      timeOut: 2000,
      progressBar: true,
      closeButton: false,
    };
    this.showToast(errorMessage, action, 'success', config);
  }




  invalidFormError() {
    this.showToast('Invalid form submission','Invalid Form', 'error');
  }
  

}
