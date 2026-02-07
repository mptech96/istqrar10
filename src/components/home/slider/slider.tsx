import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

export type sliderProps = {
  title: string;
  image: string;
};

const Slider = ({
  data,
  autoplay = false,
  className,
  itemClassName,
  showControls = true,
}: {
  data: sliderProps[];
  autoplay?: boolean;
  className?: string;
  itemClassName?: string;
  showControls?: boolean;
}) => {
  return (
    <Carousel
      className={cn("w-full  ", className)}
      plugins={
        autoplay
          ? [
              Autoplay({
                delay: 2000,
              }),
            ]
          : []
      }
      opts={{ loop: true }}
    >
      <CarouselContent>
        {data.map((item, index) => (
          <CarouselItem
            key={index}
            className={cn(itemClassName)}
          >
            <div className="">
              <Card className=" bg-linear-to-br from-coralRed/5 to-cyan-500/5 border border-coralRed/10">
                <CardContent className="flex items-center justify-center p-0">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full rounded-md object-contain"
                    />
                  </AspectRatio>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {showControls && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
};

export default Slider;
