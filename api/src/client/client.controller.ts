import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { DecodedIdToken } from 'firebase-admin/auth';
import { Roles } from '@app/utils/decorators/roles.decorator';
import { FirebaseAuthGuard } from '@app/utils/guards/firebase-auth.guard';
import { RolesGuard } from '@app/utils/guards/role.guard';
import { UserRole } from '@app/user/models/user.model';
import { Token } from '@app/utils/decorators/token.decorator';

@Controller('clients')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @Roles(UserRole.TRAINER, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClientDto: CreateClientDto, @Token() token: DecodedIdToken) {
    const clientId = await this.clientService.create(createClientDto, token.uid);
    return { id: clientId };
  }

  @Get()
  @Roles(UserRole.TRAINER, UserRole.ADMIN)
  async findAll(@Token() token: DecodedIdToken) {
    return await this.clientService.findAll();
  }

  @Get('me')
  @Roles(UserRole.CLIENT, UserRole.TRAINER, UserRole.ADMIN)
  async getMyProfile(@Token() token: DecodedIdToken) {
    return await this.clientService.findByUserId(token.uid);
  }

  @Get(':id')
  @Roles(UserRole.TRAINER, UserRole.ADMIN, UserRole.CLIENT)
  async findOne(@Param('id') id: string, @Token() token: DecodedIdToken) {
    const userRole = token.role as UserRole;
    return await this.clientService.findOne(id, token.uid, userRole);
  }

  @Patch(':id')
  @Roles(UserRole.TRAINER, UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @Token() token: DecodedIdToken) {
    const userRole = token.role as UserRole;
    return await this.clientService.update(id, updateClientDto, token.uid, userRole);
  }

  @Get('my-clients')
  @Roles(UserRole.TRAINER, UserRole.ADMIN)
  async findMyClients(@Token() token: DecodedIdToken) {
    return await this.clientService.findByTrainerId(token.uid);
  }

  @Patch(':id/link-user/:userId')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async linkToUser(@Param('id') id: string, @Param('userId') userId: string, @Token() token: DecodedIdToken) {
    return await this.clientService.linkToUser(id, userId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Token() token: DecodedIdToken) {
    const userRole = token.role as UserRole;
    await this.clientService.remove(id, token.uid, userRole);
  }
}
