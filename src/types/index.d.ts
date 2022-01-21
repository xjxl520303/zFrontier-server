// 将对象键值转换成首字母大写
type CapitalizeObject<T> = { [P in keyof T as Capitalize<string & P>]: T[P] };

// 将对象键值转换成首字母小写
type UncapitalizeObject<T> = { [P in keyof T as Uncapitalize<string & P>]: T[P] };
