interface MainArgs<
  EXTERNAL_SERVICES extends Record<string, any>,
  INTERNAL_SERVICES extends Record<string, any>,
> {
  readonly run?: MainRunFunction<INTERNAL_SERVICES>
  readonly configure?: MainConfigureFunction<EXTERNAL_SERVICES, INTERNAL_SERVICES>
  readonly externalServices?: EXTERNAL_SERVICES
};

type MainRunFunction<
  INTERNAL_SERVICES extends Record<string, any>,
> = (services: INTERNAL_SERVICES) => any

type MainConfigureFunction<
  EXTERNAL_SERVICES extends Record<string, any>,
  INTERNAL_SERVICES extends Record<string, any>,
> = (externalServices: EXTERNAL_SERVICES) => INTERNAL_SERVICES

export const application = <
  EXTERNAL_SERVICES extends Record<string, any> = {},
  INTERNAL_SERVICES extends Record<string, any> = {},
>({
    run = () => 0,
    configure = (services: EXTERNAL_SERVICES) => services as INTERNAL_SERVICES,
    externalServices = {} as unknown as EXTERNAL_SERVICES,
  }: MainArgs<EXTERNAL_SERVICES, INTERNAL_SERVICES>): ReturnType<typeof run> =>
    run(configure(externalServices))
