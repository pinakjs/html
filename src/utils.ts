export const DELIMETER = '###'

export const isArray = Array.isArray

export const isFunction = (v: any): v is Function => {
    return typeof v === 'function'
}

export const splitString = (string: string, type: string) => {
    return string.split(type)
}

export const isVoidTag = new Set(splitString('area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr', ','))