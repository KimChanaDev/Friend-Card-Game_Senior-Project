import { IsString, Matches, MaxLength, MinLength, IsEmail, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from 'class-validator';

// @ValidatorConstraint({ name: 'passwordMatch', async: false })
// export class PasswordMatchConstraint implements ValidatorConstraintInterface {
//   validate(confirmPassword: string, args: ValidationArguments) {
//     const password = (args.object as any).password;
//     return confirmPassword === password;
//   }

//   defaultMessage(args: ValidationArguments) {
//     return 'Passwords do not match';
//   }
// };


export class UserDataDTO {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/)
  username!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9!@#$%^&*]+$/)
  password!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9!@#$%^&*]+$/)
  // @Validate(PasswordMatchConstraint, {
  //   message: 'Passwords do not match',
  // })
  confirmPassword!: string;

  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  imagePath!: string;
}

export class LoginDTO {
  @IsString()
  // @MinLength(6)
  // @MaxLength(20)
  // @Matches(/^[a-zA-Z0-9_]+$/)
  username!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9!@#$%^&*]+$/)
  password!: string;
}

export class ProfileDTO {
  @IsString()
  displayName!: string;

  @IsString()
  imagePath!: string;

  @IsString()
  sub!: string;
}