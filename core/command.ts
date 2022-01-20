export interface CoreCommand {
  [key: string]: (...args: any[]) => void
}
