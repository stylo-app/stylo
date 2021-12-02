{
  description = "A very basic flake";

  inputs = {
    utils.url = "github:numtide/flake-utils";
    
    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, utils, fenix }: 
    utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};

      rust = fenix.packages.${system}.fromToolchainFile {
        file = ./rust-toolchain.toml;
        sha256 = "CtlU5P+v0ZJDzYlP4ZLA9Kg5kMEbSHbeYugnhCx0q0Q=";
      };

      androidEnv = pkgs.androidenv.override { licenseAccepted = true; };

      androidPkgs = androidEnv.composeAndroidPackages { 
        abiVersions = [ "arm64-v8a" "armeabi-v7a" "x86" "x86_64" ];
        includeNDK = true;
      };
    in {
      devShell = pkgs.mkShell {
        packages = [ rust androidPkgs.androidsdk ];

        NDK_HOME = "${androidPkgs.ndk-bundle}/libexec/android-sdk/ndk-bundle";
      };
    });
}
