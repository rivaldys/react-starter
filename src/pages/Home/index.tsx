import { Layout } from '@/components'

export default function Home()
{
    return (
        <>
            <title>Home &#8729; React Starter</title>
            <meta name="description" content="Welcome to React Starter - A React boilerplate with Atomic Design methodology for building scalable web applications." />
            <meta name="keywords" content="React, Starter, Boilerplate, Atomic Design, TypeScript" />
            <meta property="og:title" content="Home | React Starter" />
            <meta property="og:description" content="A React boilerplate with Atomic Design methodology." />
            <meta property="og:type" content="website" />

            <Layout>
                <div className="greeting-wrapper">
                    <h1 className="title text-center">Welcome to React Starter!</h1>
                    <p className="text-center">A React boilerplate with Atomic Design methodology.</p>
                </div>

                <p className="paragraph-section">
                    Edit <code>src/pages/Home/index.tsx</code> and save to test HMR
                </p>
            </Layout>
        </>
    )
}