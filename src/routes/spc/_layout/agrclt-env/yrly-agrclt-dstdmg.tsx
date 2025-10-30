import { createFileRoute } from '@tanstack/react-router'
import { YearlyDisasterInfo } from '~/pages/visualization'

export const Route = createFileRoute('/spc/_layout/agrclt-env/yrly-agrclt-dstdmg')({
  component: RouteComponent,
})

function RouteComponent() {
  return <YearlyDisasterInfo />
}
