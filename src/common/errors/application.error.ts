import { HttpException, HttpStatus } from '@nestjs/common';

export class ApplicationError extends HttpException {
    public message: string;
    constructor(
        public readonly code: string,
        status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    ) {
        super(code, status);
        this.name = 'ApplicationError';
    }
}
