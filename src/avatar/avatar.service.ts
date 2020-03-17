import { Injectable } from '@nestjs/common';
import jdenticon from 'jdenticon';
import { AVATAR_SIZE } from '../constants';

@Injectable()
export class AvatarService {
  generateAvatar(id: string): Buffer {
    return jdenticon.toPng(id, AVATAR_SIZE, {
      lightness: {
        color: [0.53, 0.88],
        grayscale: [0.71, 0.9],
      },
      saturation: {
        color: 0.62,
        grayscale: 0.92,
      },
      backColor: '#2a4766ff',
      padding: 0.08,
    });
  }
}
