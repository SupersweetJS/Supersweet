interface ReconcileState  {
  _keyHash: Record<string, any>,
  _keys: string[],
  _values: any[]
}

interface ReconcileSteps {
  _remove: number[],
  _add: [number, any][],
  _swap: [number, number][]
}