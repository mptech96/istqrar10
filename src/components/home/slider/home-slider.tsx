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

const HomeSlider = ({
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
      className={cn("w-full", className)}
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
            <div className="p-0">
              <Card className="border-0 shadow-none">
                <CardContent className="flex items-center justify-center p-0">
                  <AspectRatio
                    ratio={21 / 9}
                    className="bg-muted"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
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
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </>
      )}
    </Carousel>
  );
};

export default HomeSlider;
