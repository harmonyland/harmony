FROM denoland/deno:1.12.2

RUN apt-get -y update
RUN apt-get -y install git

RUN deno install -qAn vr https://deno.land/x/velociraptor@1.1.0/cli.ts
