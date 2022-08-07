// 语法树节点定义

import valueParser from './parser/value'

class Node {
  constructor (treeBuilder) {
    this.treeBuilder = treeBuilder
    this.parentNode = treeBuilder.curNode
    treeBuilder.putNode(this)
  }

  doc () {
    throw Error('Node.doc must be override')
  }

  code () {
    throw Error('Node.code must be override')
  }
}

class NodeContainer extends Node {
  constructor () {
    super(...arguments)
    this.fields = []
  }

  // 获取字段生成的代码
  fieldsCode () {
    return this.fields.map(item => item.code()).join('\n')
  }

  // 获取所有字段生成的keys
  keysCode () {
    const keys = []
    this.fields.forEach(item => {
      if (!item.fieldValueExpression && !item.childNode) {
        keys.push(item.fieldKey)
      }
    })
    return keys.join(', ')
  }

  // 获取字段生成的文档
  fieldsDoc () {
    return this.fields.map(item => item.doc()).join('\n')
  }
}

class MapNode extends NodeContainer {
  code () {
    if (this.parentNode) {
      return `$map(function(){
        ${this.fieldsCode()}
      });`
    }
    return this.fieldsCode()
  }
}

class ListNode extends NodeContainer {
  code () {
    const { parentNode, childNode } = this
    const bodyCode = childNode
      ? childNode.code()
      : `$map(function(){
        ${this.fieldsCode()}
      });`

    return `$list(${parentNode.listLength}, function(){
      ${bodyCode}
    });`
  }
}

class ValueNode extends NodeContainer {
  code () {
    return `$value(function(){
      ${this.blockExpressions ? this.blockExpressions.join('') : ''}
      return ${valueParser(this.returnExpression)}
    });`
  }
}

class JsNode extends Node {
  code () {
    return this.codeExpression
  }
}

class FieldNode extends Node {
  code () {
    const key = this.fieldKeyCode()

    const { fieldValueExpression, childNode } = this
    let bodyCode
    if (fieldValueExpression) {
      bodyCode = `$value(function(){
        return ${valueParser(fieldValueExpression)}
      });`
    } else if (childNode) {
      bodyCode = childNode.code()
    } else {
      bodyCode = `$value(function(){
        return this.${key}
      });`
    }

    const mtdName = this.parentNode === this.treeBuilder.rootNode ? '$export' : '$field'
    return `${mtdName}("${key}", function(){
      ${bodyCode}
    });`
  }

  // 键名格式化
  fieldKeyCode () {
    return this.fieldKey.replace(/[^.]+\./, '')
  }
}

export {
  MapNode,
  ListNode,
  ValueNode,
  JsNode,
  FieldNode,
}
