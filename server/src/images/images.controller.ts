import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  UseGuards,
  Req,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImagesService } from "./images.service";
import { CreateImageDto } from "./dto/create-image.dto";
import { UpdateImageDto } from "./dto/update-image.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { UserRole } from "../users/user-role.enum";
import { Request } from "express";
import { User } from "../users/user.entity";
import { FileTypeValidator } from "../decorators/file-type.decorator";

@Controller("images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async findAll() {
    return this.imagesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: Request) {
    return this.imagesService.findOne(
      parseInt(id),
      req.user ? (req.user as User).id : undefined
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator(["image/jpeg", "image/png"])],
      })
    )
    file: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
    @Req() req: Request
  ) {
    return this.imagesService.create(file, createImageDto, req.user as User);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @Body() updateImageDto: UpdateImageDto,
    @Req() req: Request
  ) {
    return this.imagesService.update(
      parseInt(id),
      updateImageDto,
      req.user as User
    );
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async remove(@Param("id") id: string, @Req() req: Request) {
    return this.imagesService.remove(parseInt(id), req.user as User);
  }

  @Patch(":id/approve")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async approveImage(
    @Param("id") id: string,
    @Body("is_approved") isApproved: boolean
  ) {
    return this.imagesService.approveImage(parseInt(id), isApproved);
  }

  @Get(":id/signed-url")
  @UseGuards(JwtAuthGuard)
  async getSignedUrl(@Param("id") id: string, @Req() req: Request) {
    const image = await this.imagesService.findOne(
      parseInt(id),
      (req.user as User).id
    );

    return this.imagesService.getSignedUrl(image);
  }
}
