import { Layout } from '@/components'

export default function Home()
{
    return (
        <Layout>
            <div className="greeting-wrapper">
                <h1 className="title text-center">Welcome to React Starter!</h1>
                <p className="text-center">A React boilerplate with Atomic Design methodology.</p>
            </div>

            <p className="paragraph-section">
                Edit <code>src/pages/Home/index.tsx</code> and save to test HMR
            </p>
        </Layout>
    )
}