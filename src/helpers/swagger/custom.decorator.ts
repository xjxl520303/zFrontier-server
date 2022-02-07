import { applyDecorators, Type } from "@nestjs/common"
import { ApiBadRequestResponse, ApiExtraModels, ApiOkResponse, ApiProperty, ApiResponseOptions, getSchemaPath } from "@nestjs/swagger"

class DataWrap<Dto> {
  @ApiProperty({ type: 'string | Array', description: '返回数据主体内容' })
  data: Dto | Array<any>
}

/**
 * Swagger 成功返回封装,
 * @param model 可以传 DTO 或 字符串
 */
export const ApiCustomOkResponse = <TModel extends Type<any>>(model: TModel | any) => {
  const isString = typeof model === 'string';
  const response = ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(DataWrap) },
        {
          properties: {
            status: {
              type: 'number',
              default: 0,
              description: '`0`: 成功返回，`1`: 验证不通过或服务器出现错误'
            },
            data: (() => {
              if (isString) {
                return {
                  type: 'string',
                  $ref: getSchemaPath(model),
                  default: model
                }
              } else {
                return {
                  type: 'object',
                  $ref: getSchemaPath(model),
                  default: model
                }
              }
            })(),
            message: {
              type: 'string',
              default: '',
              description: '如果`status`不为`0`，则显示错误的描述信息'
            }
          }
        }
      ]
    }
  });

  if (isString) {
    return applyDecorators(
      response,
      ApiExtraModels(DataWrap),
    )
  } else {
    return applyDecorators(
      response,
      ApiExtraModels(DataWrap),
      ApiExtraModels(model)
    )
  }
}

/**
 * Swagger 失败返回封装
 */
export const ApiCustomErrorResponse = () => {
  return applyDecorators(
    ApiBadRequestResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(DataWrap) },
          {
            properties: {
              status: {
                type: 'number',
                default: 1,
                description: '`0`: 成功返回，`1`: 验证不通过或服务器出现错误'
              },
              data: {
                type: 'Array',
                default: []
              },
              message: {
                type: 'string',
                default: '错误描述信息',
                description: '如果`status`不为`0`，则显示错误的描述信息'
              }
            }
          }
        ]
      }
    }),
    ApiExtraModels(DataWrap)
  )
}
