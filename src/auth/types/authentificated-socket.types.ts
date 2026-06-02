import { JwtPayload } from './jwt-payload.types';
import { Socket } from 'socket.io';

export type AuthenticatedSocket = Socket & {
  user: JwtPayload;
  handshake?: Socket['handshake'] & {
    auth: {
      token?: string;
    }
  };
}
