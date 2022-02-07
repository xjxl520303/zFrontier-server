import { ApiProperty } from "@nestjs/swagger";

export class UserResDto {
  @ApiProperty({ type: 'number', description: '用户ID' })
  id;

  @ApiProperty({ type: 'string', description: '用户地址 Hash', default: 'SW3wFp3Eoyuy' })
  hashId;

  @ApiProperty({ type: 'string', description: '用户昵称', default: '张三' })
  nickname;

  @ApiProperty({ type: 'string', description: '头像', default: '' })
  avatarPath;

  @ApiProperty({ type: 'string', description: 'profile 封面图', default: '' })
  cover;

  @ApiProperty({ type: 'string', description: '加入时间', default: '2022-01-26T11:48:33.407Z' })
  joinAt;
}
