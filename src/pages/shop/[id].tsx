import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { VehicleInformation } from "@Models/vehicleInformation";
import { getVehicleById } from "@Services/vehicleServices";
import { Flex, Text } from "vcc-ui";
import VehicleCard from "@Components/VehicleCard";
import Head from "next/head";

interface ShopPageProps {
  vehicle: VehicleInformation;
}

export default function ShopPage({ vehicle }: ShopPageProps) {
  const title = `Purchase ${vehicle.modelName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Flex as="main" extend={{ alignItems: "center", padding: 24 }}>
        <Text variant="peary" extend={{ textAlign: "center" }}>
          {title}
        </Text>

        <VehicleCard
          as="section"
          vehicleInfo={vehicle}
          interactive={false}
          extend={{
            width: "100%",
            maxWidth: 600,
            marginTop: 100,
          }}
        />
      </Flex>
    </>
  );
}

export const getStaticPaths: GetStaticPaths<{ id: string }> = async (
  context
) => {
  return {
    // did generate static shop page content when building project
    // all the shop pages are generated later
    paths: [],
    fallback: "blocking",
  };
};

/**
 * getStaticProps could be cache by CDN, since the max-age=1800.
 * This function will be executed when
 * - A request comes in
 * - At most once every 30 minutes
 *
 * HTTP Response Headers:
 * Cache-Control: s-maxage=1800, stale-while-revalidate
 */
export const getStaticProps: GetStaticProps<
  ShopPageProps,
  { id: string }
> = async (context) => {
  if (!context.params) {
    return { notFound: true };
  }

  const { id } = context.params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    return { notFound: true };
  }

  return {
    props: { vehicle },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 30 minutes

    // Result -
    // HTTP Response Headers:
    // Cache-Control: s-maxage=1800, stale-while-revalidate
    revalidate: 30 * 60, // In seconds
  };
};
