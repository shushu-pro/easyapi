import {
  MapNode,
  ListNode,
  ValueNode,
  FieldNode,
  JsNode,
} from './treeNodes'

export default function treeBuilder () {
  return new Builder(...arguments)
}

class Builder {
  constructor () {
    this.createMapNode()
  }

  createMapNode () {
    new MapNode(this)
  }

  createListNode () {
    new ListNode(this)
  }

  createFieldNode () {
    new FieldNode(this)
  }

  createValueNode () {
    new ValueNode(this)
  }

  createJsNode () {
    new JsNode(this)
  }

  createDocument (text) {
    this.curNode.document = text
  }

  // 设置数组length
  setListLength (length) {
    if (/^\d+$/.test(length)) {
      length = Number(length)
    } else if (/^[$\w.]+$/.test(length)) {

    } else {
      length = 0
    }
    this.curNode.listLength = length
  }

  // 设置字段键
  setFieldKey (text) {
    this.curNode.fieldKey = text
  }

  setFieldValueExpression (text) {
    this.curNode.fieldValueExpression = text
  }

  setValueBlockExpression (text) {
    this.curNode.blockExpressions = this.curNode.blockExpressions || []
    this.curNode.blockExpressions.push(text)
  }

  setValueReturnExpression (text) {
    this.curNode.returnExpression = text
  }

  setJsCodeExpression (text) {
    this.curNode.codeExpression = text
  }

  putNode (node) {
    if (!this.rootNode) {
      this.rootNode = node
    }
    this.curNode = node
  }

  // 完成创建后回退操作栈
  finishCreate () {
    const { curNode } = this
    const { parentNode } = curNode

    if (parentNode.fields) {
      parentNode.fields.push(curNode)
    } else {
      parentNode.childNode = curNode
    }

    this.curNode = parentNode
  }

  getValue () {
    return this.rootNode
  }
}
