export interface HttpErrorBody {
  code?: number,
  errorDetails?: {error?: string},
  message?: string,
  status?: string,
  timestamp?: string
}

export interface HttpResponseBody {
  code?: number,
  data?: any,
  message?: string,
  status?: string,
  timestamp?: string
}