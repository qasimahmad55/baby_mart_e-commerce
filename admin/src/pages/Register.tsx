import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { motion } from 'motion/react'

function Register() {
  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='w-full max-w-md px-4'>
        <Card className='w-full bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200'>
          <CardHeader className='text-center space-y-2'>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CardTitle className='text-3xl font-bold text-gray-800'>
                Create an Account
              </CardTitle>
              <CardDescription className='text-gray-500'>
                Enter your details to sign up
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            <Form>
          <form>
            
          </form>
            </Form>
          </CardContent>

        </Card>
      </motion.div>
    </div>
  )
}

export default Register