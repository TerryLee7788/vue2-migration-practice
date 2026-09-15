// ✅ 遷移點 4：Vue 2 全域 mixin（後來過渡成 Vue 3 app.mixin）在這裡進一步改寫成 composable。
//    Composition API 下不再需要隱式掛在每個元件 instance 上的全域方法，
//    改成一般函式，哪個元件要用就自己 import useLogger()，來源清楚、也不會跟元件自身方法撞名。
export function useLogger() {
  function log(msg) {
    // eslint-disable-next-line no-console
    console.log('[logger composable]', msg)
  }

  return { log }
}
