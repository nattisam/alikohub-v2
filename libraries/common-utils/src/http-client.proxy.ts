import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';

export class HttpClientProxy extends ClientProxy {
  private readonly logger = new Logger(HttpClientProxy.name);

  constructor(
    private readonly httpService: any, // Using any to avoid mandatory dependency on @nestjs/axios in this lib
    private readonly baseUrl: string,
    private readonly mapping: Record<string, string> = {},
  ) {
    super();
  }

  async connect(): Promise<any> {}
  async close() {}
  unwrap<T>(): T {
    return {} as T;
  }

  async dispatchEvent(packet: ReadPacket<any>): Promise<any> {
    const url = this.mapPatternToUrl(packet.pattern);
    return lastValueFrom(this.httpService.post(`${this.baseUrl}/${url}`, packet.data));
  }

  protected publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void,
  ): () => void {
    const url = this.mapPatternToUrl(packet.pattern);
    
    lastValueFrom(this.httpService.post(`${this.baseUrl}/${url}`, packet.data))
      .then((response: any) => {
        callback({ response: response.data });
      })
      .catch((err: any) => {
        const errorData = err.response?.data || { 
          message: err.message, 
          statusCode: err.response?.status || 500 
        };
        callback({ err: errorData });
      });

    return () => {};
  }

  private mapPatternToUrl(pattern: any): string {
    const cmd = typeof pattern === 'string' ? pattern : pattern.cmd;
    let url = this.mapping[cmd] || cmd.replace(/_/g, '-');
    return url;
  }
}
