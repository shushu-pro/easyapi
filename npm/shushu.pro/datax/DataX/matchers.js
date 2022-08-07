export default {
  main: {
    source: ' <field>& | <js> ',
  },

  field: {
    source: `
      '@' <fieldKey>
      (
        <eol>& |
        ( <s>+ <fieldValueExpression> <eol> )& |
        ( '(' <s>* ')' )? <block>& |
        ( '(' <listLength> ')' <list>& )
      ) 
    `,
    before: treeBuilder => treeBuilder.createFieldNode(),
    done: treeBuilder => treeBuilder.finishCreate(),
    document: (treeBuilder, text) => treeBuilder.createDocument(text),
  },
  fieldKey: {
    source: ' <w>+ ',
    done: (treeBuilder, text) => treeBuilder.setFieldKey(text),
  },
  fieldValueExpression: {
    source (sr) {
      let hasMatched = false
      while (true) {
        if (sr.read() === sr.EOL) {
          sr.back()
          break
        }
        hasMatched = true
      }
      return hasMatched
    },
    done: (treeBuilder, text) => treeBuilder.setFieldValueExpression(text),
  },

  block: {
    source: '<map>& | <list>& | <value>&',
  },

  map: {
    source: `
      '{' <eol> <field>*& '}' <eol> 
    `,
    before: treeBuilder => treeBuilder.createMapNode(),
    done: treeBuilder => treeBuilder.finishCreate(),
  },

  list: {
    source: `
      '[' <eol> <field>*& ']' <eol>
    `,
    before: (treeBuilder) => treeBuilder.createListNode(),
    done: treeBuilder => treeBuilder.finishCreate(),
  },
  listLength: {
    source: ' <d>+ | (<w> | \'.\' | \'$\')+ ',
    done: (treeBuilder, text) => treeBuilder.setListLength(text),
  },

  value: {
    source: `
      '(:' <eol> <valueBlockExpression>* <valueReturnExpression> ':)' <eol>?
    `,
    before: treeBuilder => treeBuilder.createValueNode(),
    done: treeBuilder => treeBuilder.finishCreate(),
  },
  valueBlockExpression: {
    source: function (sr) {
      const text = []
      while (true) {
        const cr = sr.read()
        if (cr === sr.EOL) {
          break
        }
        text.push(cr)
      }
      const line = text.join('')
      if (/^@|^:\)$/.test(line)) {
        return false
      }
      return true
    },
    done: (treeBuilder, text) => treeBuilder.setValueBlockExpression(text),
  },
  valueReturnExpression: {
    source (sr) {
      if (sr.read() !== '@' || sr.read() !== ' ') {
        return false
      }
      while (true) {
        if (sr.read() === sr.EOL) {
          break
        }
      }
      return true
    },
    done: (treeBuilder, text) => treeBuilder.setValueReturnExpression(text.slice(2, -1)),
  },

  js: {
    source: ' <.>+ <eol> ',
    before: treeBuilder => treeBuilder.createJsNode(),
    done: (treeBuilder, text) => {
      treeBuilder.setJsCodeExpression(text.slice(0, -1))
      treeBuilder.finishCreate()
    },
  },
}
