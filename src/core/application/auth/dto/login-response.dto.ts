import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({
        description: 'JWT access token for authenticated requests',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        type: String,
    })
    accessToken: string;

    @ApiProperty({
        description: 'Type of the token',
        example: 'Bearer',
        type: String,
    })
    tokenType: string;

    @ApiProperty({
        description: 'Token expiration time in seconds',
        example: 3600,
        type: Number,
    })
    expiresIn: number;
}
