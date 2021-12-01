ARCHS_IOS = x86_64-apple-ios armv7-apple-ios armv7s-apple-ios aarch64-apple-ios
ARCHS_ANDROID = aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
LIB=libsigner.a
API_LEVEL=$(shell grep API_LEVEL ../../scripts/variables.sh |tr -c -d '[:digit:]')
OS_ARCH=$(shell uname | tr '[:upper:]' '[:lower:]')
ANDROID_PREBUILD_BIN=${NDK_HOME}/toolchains/llvm/prebuilt/${OS_ARCH}-x86_64/bin
ANDROID_TARGET_DIR=../../android/app/src/main/jniLibs


toupper = $(shell echo $(1) | tr a-z A-Z)


.PHONY: all ios $(ARCHS_IOS) android $(ARCHS_ANDROID)


all: ios android


ios: $(LIB)

$(LIB): $(ARCHS_IOS)
	lipo -create -output $@ $(foreach arch,$(ARCHS_IOS),$(wildcard target/$(arch)/release/$(LIB)))

$(ARCHS_IOS):
	cargo build --target $@ --release --no-default-features


android: $(ARCHS_ANDROID)
	mkdir -p $(ANDROID_TARGET_DIR)/{arm64-v8a,armeabi-v7a,x86,x86_64}
	cp target/aarch64-linux-android/release/libsigner.so $(ANDROID_TARGET_DIR)/arm64-v8a
	cp target/armv7-linux-androideabi/release/libsigner.so $(ANDROID_TARGET_DIR)/armeabi-v7a
	cp target/i686-linux-android/release/libsigner.so $(ANDROID_TARGET_DIR)/x86
	cp target/x86_64-linux-android/release/libsigner.so $(ANDROID_TARGET_DIR)/x86_64

$(ARCHS_ANDROID):
	CC_$(subst -,_,$@)="${ANDROID_PREBUILD_BIN}/$(subst armv7,armv7a,$@)${API_LEVEL}-clang" \
	CARGO_TARGET_$(call toupper,$(subst -,_,$@))_LINKER="${ANDROID_PREBUILD_BIN}/$(subst armv7,armv7a,$@)${API_LEVEL}-clang" \
	AR_$(subst -,_,$@)="${ANDROID_PREBUILD_BIN}/$(subst armv7,arm,$@)-ar" \
	cargo build --target $@ --release
