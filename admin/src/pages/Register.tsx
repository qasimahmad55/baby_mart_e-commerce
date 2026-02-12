import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'motion/react'

function Register() {
  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <motion.div className='w-full max-w-md px-4'>
        <Card>
          <CardHeader>
            <motion.div>
              <CardTitle>
                Create an Account
              </CardTitle>
            </motion.div>
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  )
}

export default Register