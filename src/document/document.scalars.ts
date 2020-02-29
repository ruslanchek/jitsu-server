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

@Scalar('DocumentType', type => EDocumentType)
export class DocumentTypeScalar implements CustomScalar<number, EDocumentType> {
  description = 'EDocumentType custom scalar type';

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
  description = 'EDocumentType custom scalar type';

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

