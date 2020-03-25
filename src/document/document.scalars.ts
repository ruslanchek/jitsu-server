import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind } from 'graphql';

export enum EDocumentType {
  Task,
  Story,
  Document,
}

export enum EDocumentPriority {
  Default,
  Low,
  Medium,
  High,
}

export enum EDocumentStatus {
  Idle,
  Paused,
  InProgress,
  Completed,
  Archived,
}

@Scalar('DocumentType', type => EDocumentType)
export class DocumentTypeScalar implements CustomScalar<number, EDocumentType> {
  description = 'DocumentType custom scalar type';

  parseValue(value: number): EDocumentType {
    return value;
  }

  serialize(value: EDocumentType): number {
    return value;
  }

  parseLiteral(ast: any): EDocumentType {
    if (ast.kind === Kind.INT) {
      return ast.value;
    }
    return null;
  }
}

@Scalar('DocumentPriority', type => EDocumentPriority)
export class DocumentPriorityScalar implements CustomScalar<number, EDocumentPriority> {
  description = 'DocumentPriority custom scalar type';

  parseValue(value: number): EDocumentPriority {
    return value;
  }

  serialize(value: EDocumentPriority): number {
    return value;
  }

  parseLiteral(ast: any): EDocumentPriority {
    if (ast.kind === Kind.INT) {
      return ast.value;
    }
    return null;
  }
}

@Scalar('DocumentStatus', type => EDocumentStatus)
export class DocumentStatusScalar implements CustomScalar<number, EDocumentStatus> {
  description = 'DocumentStatus custom scalar type';

  parseValue(value: number): EDocumentStatus {
    return value;
  }

  serialize(value: EDocumentStatus): number {
    return value;
  }

  parseLiteral(ast: any): EDocumentStatus {
    if (ast.kind === Kind.INT) {
      return ast.value;
    }
    return null;
  }
}
