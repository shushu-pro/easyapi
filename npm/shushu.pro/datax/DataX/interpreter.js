import vm from 'vm'
import context from './context'

// 返回执行器
export default function interpreter (code) {
  let script = null

  return function (customContext) {
    const dataExports = {}
    const runtime = {}
    const systemAPI = {
      $export (key, getter) {
        dataExports[key] = (systemAPI.$field(key, getter)).value(runtime)
      },
      $field (key, getter) {
        const fieldNode = new FieldNode(getter, runtime, key)
        runtime.curNode.appendChild(fieldNode)
        return fieldNode
      },
      $map (getter) {
        runtime.curNode.appendChild(new MapNode(getter, runtime))
      },
      $list (arr, getter) {
        runtime.curNode.appendChild(new ListNode(getter, runtime, arr))
      },
      $block (getter) {
        runtime.curNode.appendChild(new BlockNode(getter, runtime))
      },
      $value (getter) {
        runtime.curNode.appendChild(new ValueNode(getter, runtime))
      },
      value () {
        return runtime.curNode.value(runtime)
      },
      $log () {
        console.warn(...arguments)
      },
    }

    runtime.curNode = new MapNode(() => { }, runtime)

    script = script || (() => {
      return new vm.Script(code, { })
    })()

    try {
      script.runInNewContext(Object.assign({}, customContext, context, systemAPI, {
        $exports: dataExports,
      }), { timeout: 1000 * 6 })
    } catch (err) {
      const errLine = err.stack.match(/<anonymous>:(\d+):\d+/)[1]
      const errMessage = err.message
      const errCodes = code.split(/\n/)
      const error = {
        line: errLine,
        message: errMessage,
        codes: errCodes.map((code, i) => `${i + 1}:  ${code}`),
        lineCode: code.split(/\n/)[errLine - 1],
      }

      dataExports.$error = error
    }

    return dataExports
  }
}

let pid = 1
class Node {
  constructor (getter, runtime) {
    this.PID = pid++
    this.parentNode = runtime.curNode
    this.Context = function () {}
    this.context = this.Context.prototype = this.parentNode ? new this.parentNode.Context() : { } // 从上一级环境中继承上下文变量
    // this.context.PID = this.PID
    // this.context.NodeType = this.constructor.name
    this.getter = getter
  }

  // 在获取值的时候，通过调用getter生成子节点结构
  getterProxy (runtime) {
    runtime.curNode = this
    runtime.curNode.getter.call(this.context, runtime)
    runtime.curNode = this.parentNode
  }

  appendChild (childNode) {
    this.childNode = childNode
  }
}

class MapNode extends Node {
  constructor () {
    super(...arguments)
    this.fields = {}
  }

  appendChild (childNode) {
    // 后续的同名字段会覆盖前面的字段
    if (this.fields[childNode.key]) {
      delete this.fields[childNode.key]
    }
    this.fields[childNode.key] = childNode
  }

  value (runtime) {
    this.getterProxy(runtime)
    const value = {}
    for (const key in this.fields) {
      runtime.curNode = this
      value[key] = this.context[key] = this.fields[key].value(runtime)

      // 将值挂载到外层环境中
      let curNode = this.parentNode
      while (curNode) {
        const fieldKey = curNode.key
        if (fieldKey) {
          (curNode.parentNode.context[fieldKey] = (curNode.parentNode.context[fieldKey] || {}))[key] = value[key]
          break
        }
        curNode = curNode.parentNode
      }

      runtime.curNode = this.parentNode
    }
    return value
  }
}

class FieldNode extends Node {
  constructor (getter, runtime, key) {
    super(getter, runtime)
    this.key = key
  }

  value (runtime) {
    this.getterProxy(runtime)
    if (this.childNode) {
      return this.childNode.value(runtime)
    }
  }
}

class ValueNode extends Node {
  value (runtime) {
    const value = this.getter.call(this.context, runtime)
    return value === undefined ? null : value
  }
}

class ListNode extends Node {
  constructor (getter, runtime, arr) {
    super(getter, runtime)
    this.arr = arr
    this.context.$total = 0
  }

  value (runtime) {
    this.getterProxy(runtime)
    runtime.curNode = this
    const value = []
    const childNode = this.childNode
    if (!childNode) {
      return value
    }

    if (Array.isArray(this.arr)) {
      // 数据库模式
      const rs = this.arr
      for (let i = 0; i < rs.length; i++) {
        this.context.$index = i
        this.context.$total++
        Object.assign(this.context, rs[i])
        value.push(this.childNode.value(runtime))
      }
    } else {
      // 常规mock模式
      for (let i = 0; i < this.arr; i++) {
        this.context.$index = i
        this.context.$total++
        value.push(this.childNode.value(runtime))
      }
    }
    runtime.curNode = this.parentNode
    return value
  }
}

class BlockNode extends Node {
  value (runtime) {
    runtime.curNode = this
    const value = this.getter.call(this.context)
    runtime.curNode = this.parentNode
    return value
  }
}
