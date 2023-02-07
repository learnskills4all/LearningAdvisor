import { PickType } from "@nestjs/swagger";
import { AuthenticationDto } from "src/auth/dto/authentication.dto";

export class ChangepasswordDto {
    currentPassword: string;
    newPassword: string;
}