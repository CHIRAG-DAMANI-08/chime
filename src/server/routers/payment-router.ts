import { createCheckoutSession } from "@/lib/stripe"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import Stripe from "stripe"

export const paymentRouter = router({
  createCheckoutSession: privateProcedure.mutation(async ({ c, ctx }) => {
    try {
      const { user } = ctx

      const session = await createCheckoutSession({
        userEmail: user.email,
        userId: user.id,
      })

      return c.json({ url: session.url })
    } catch (error) {
      // Enhanced error logging with type checking
      if (error instanceof Stripe.errors.StripeError) {
        console.error('Checkout session creation failed:', {
          message: error.message,
          type: error.type,
          code: error.code,
          param: error.param,
          raw: error.raw
        })
      } else {
        console.error('Unknown error:', error)
      }
      return c.json({ url: null }, 500)
    }
  }),

  getUserPlan: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx
    return c.json({ plan: user.plan })
  }),
})