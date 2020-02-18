import { InputType, Field, ID } from 'type-graphql';
import { IsUUID, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ProjectEntity } from './project.entity';
import { EErrorMessage } from '../messages';
