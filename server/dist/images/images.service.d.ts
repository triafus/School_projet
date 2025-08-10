import { Repository } from "typeorm";
import { Image } from "./image.entity";
import { CreateImageDto } from "./dto/create-image.dto";
import { UpdateImageDto } from "./dto/update-image.dto";
import { SupabaseService } from "../supabase/supabase.service";
import { User } from "../users/user.entity";
export declare class ImagesService {
    private imagesRepository;
    private supabaseService;
    private readonly BUCKET_NAME;
    constructor(imagesRepository: Repository<Image>, supabaseService: SupabaseService);
    findAll(includePrivate?: boolean): Promise<Image[]>;
    findOne(id: number, userId?: number): Promise<Image>;
    create(file: Express.Multer.File, createImageDto: CreateImageDto, user: User): Promise<Image>;
    update(id: number, updateImageDto: UpdateImageDto, user: User): Promise<Image>;
    remove(id: number, user: User): Promise<Image>;
    approveImage(id: number, isApproved: boolean): Promise<Image>;
    getUserImageCount(userId: number): Promise<number>;
    getSignedUrl(image: Image): Promise<{
        url: string;
    }>;
    private verifyOwnership;
    private validateFile;
}
