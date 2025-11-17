import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { FirebaseAuthGuard } from '@app/utils/guards/firebase-auth.guard';
import { RolesGuard } from '@app/utils/guards/role.guard';
import { DecodedIdToken } from 'firebase-admin/auth';
import { User } from '@app/utils/decorators/user.decorator';
import { Roles } from '@app/utils/decorators/roles.decorator';
import { UserRole } from '@app/user/models/user.model';

@Controller('resource')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class ResourceController {
  private readonly logger = new Logger(ResourceController.name);

  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @Roles(UserRole.TRAINER, UserRole.ADMIN)
  create(@Body() createResourceDto: CreateResourceDto) {
    return this.resourceService.create(createResourceDto);
  }

  @Get()
  @Roles(UserRole.TRAINER, UserRole.ADMIN)
  findAll() {
    return this.resourceService.findAll();
  }

  @Get('trainer')
  @Roles(UserRole.TRAINER, UserRole.ADMIN)
  fetchByTrainer(@User() user: DecodedIdToken) {
    return this.resourceService.findByTrainerId(user.uid);
  }

  @Get(':id')
  @Roles(UserRole.TRAINER, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.resourceService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.TRAINER, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto) {
    return this.resourceService.update(id, updateResourceDto);
  }

  @Delete(':id')
  @Roles(UserRole.TRAINER, UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.resourceService.remove(id);
  }
}
