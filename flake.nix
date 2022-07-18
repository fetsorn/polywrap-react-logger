{
  description = "polywrap-react-logger";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    polywrap = {
      url = "github:consideritdone/polywrap-nix";
      inputs.monorepo.url = "github:polywrap/monorepo/1048-tracing";
    };
  };
  outputs = inputs@{ self, nixpkgs, polywrap, ... }:
    let
      eachSystem = systems: f:
        let
          op = attrs: system:
            let
              ret = f system;
              op = attrs: key:
                let
                  appendSystem = key: system: ret: { ${system} = ret.${key}; };
                in attrs // {
                  ${key} = (attrs.${key} or { })
                    // (appendSystem key system ret);
                };
            in builtins.foldl' op attrs (builtins.attrNames ret);
        in builtins.foldl' op { } systems;
      defaultSystems = [
        "aarch64-linux"
        "aarch64-darwin"
        "i686-linux"
        "x86_64-darwin"
        "x86_64-linux"
      ];
    in eachSystem defaultSystems (system:
      let
        pkgs = import nixpkgs { inherit system; };
        wrapper = pkgs.stdenv.mkDerivation {
          name = "wrapper";
          src = builtins.fetchTarball {
            # https://ipfs.io/ipfs/QmbD6vJJRXQRj1YLszjhxNjUrCj8xRzbokc2vLYMcR8ZuQ`
            # https://dweb.link/api/v0/get?arg=/ipfs/bafybeif7hdvwp2ou5b3n63elqed6rh5iidmorkzslsguyjuvpxhpl53zk4&archive=true
            url =
              "https://dweb.link/api/v0/get?arg=/ipfs/bafybeif7hdvwp2ou5b3n63elqed6rh5iidmorkzslsguyjuvpxhpl53zk4&output=a.tar.gz";
            sha256 = "sha256-mg8EmWG2nii3vXWeFW7oSbHLqaJ8RizVwe0ezLOhJZk=";
          };
          installPhase = "cp -r . $out";
        };
        yarnLock = pkgs.concatTextFile {
          name = "yarn.lock";
          files = [ ./yarn.lock "${polywrap.inputs.monorepo}/yarn.lock" ];
        };
        polywrap-react-logger = pkgs.mkYarnPackage rec {
          name = "polywrap-react-logger";
          version = "0.0.1";
          src = ./.;
          inherit yarnLock;
          workspaceDependencies = [
            polywrap.packages.${system}.client-js
            polywrap.packages.${system}.core-js
            polywrap.packages.${system}.ipfs-resolver-plugin-js
            polywrap.packages.${system}.ipfs-plugin-js
            polywrap.packages.${system}.ens-resolver-plugin-js
            polywrap.packages.${system}.logger-plugin-js
            polywrap.packages.${system}.tracing-js
            polywrap.packages.${system}.react
            polywrap.packages.${system}.polywrap
          ];
          buildPhase = ''
            substituteInPlace deps/${name}/schema.graphql \
               --replace "wrap://ipfs/QmbD6vJJRXQRj1YLszjhxNjUrCj8xRzbokc2vLYMcR8ZuQ" \
                         "wrap://fs/${wrapper}"
            yarn node ${
              polywrap.packages.${system}.polywrap
            }/bin/polywrap app codegen
            substituteInPlace deps/${name}/src/wrap/schema.ts \
               --replace "wrap://fs/${wrapper}" \
                         "wrap://ipfs/QmbD6vJJRXQRj1YLszjhxNjUrCj8xRzbokc2vLYMcR8ZuQ"
            substituteInPlace deps/${name}/src/wrap/types.ts \
               --replace "wrap://fs/${wrapper}" \
                         "wrap://ipfs/QmbD6vJJRXQRj1YLszjhxNjUrCj8xRzbokc2vLYMcR8ZuQ"
            substituteInPlace deps/${name}/schema.graphql \
               --replace "wrap://fs/${wrapper}" \
                         "wrap://ipfs/QmbD6vJJRXQRj1YLszjhxNjUrCj8xRzbokc2vLYMcR8ZuQ"
            yarn react-scripts build
          '';
          dontInstall = true;
          distPhase = ''
            cp -r deps/${name}/build $out
          '';
        };
      in { packages = { inherit polywrap-react-logger wrapper; }; });
}
