<?php

return [

    /*
    |--------------------------------------------------------------------------
    | バリデーション言語行
    |--------------------------------------------------------------------------
    |
    | 以下の言語行はバリデタークラスにより使用されるデフォルトのエラー
    | メッセージです。サイズルールのようにいくつかのバリデーションを
    | 持っているものもあります。メッセージはご自由に調整してね。
    |
    */

    'accepted'             => ':attributeを承認してね。',
    'active_url'           => ':attributeが有効なURLではありません。',
    'after'                => ':attributeには、:dateより後の日付を指定してね。',
    'after_or_equal'       => ':attributeには、:date以降の日付を指定してね。',
    'alpha'                => ':attributeはアルファベットしか使えないよ。',
    'alpha_dash'           => ':attributeはアルファベットとダッシュ(-)及び下線(_)だけ使えないよ。',
    'alpha_num'            => ':attributeはアルファベット数字しか使えないよ。',
    'array'                => ':attributeは配列にしてね。',
    'before'               => ':attributeは、:dateより前の日付にしてね。',
    'before_or_equal'      => ':attributeは、:date以前の日付にしてね。',
    'between'              => [
        'numeric' => ':attributeは、:minから:maxの間で指定してね。',
        'file'    => ':attributeは、:min kBから、:max kBの間で指定してね。',
        'string'  => ':attributeは、:min文字から、:max文字の間で指定してね。',
        'array'   => ':attributeは、:min個から:max個の間で指定してね。',
    ],
    'boolean'              => ':attributeは、trueかfalseを指定してね。',
    'confirmed'            => ':attributeと、確認フィールドとが、一致していません。',
    'date'                 => ':attributeには有効な日付を指定してね。',
    'date_equals'          => ':attributeには、:dateと同じ日付けを指定してね。',
    'date_format'          => ':attributeは:format形式で指定してね。',
    'different'            => ':attributeと:otherには、異なった内容を指定してね。',
    'digits'               => ':attributeは:digits桁で指定してね。',
    'digits_between'       => ':attributeは:min桁から:max桁の間で指定してね。',
    'dimensions'           => ':attributeの図形サイズが不正だよ。',
    'distinct'             => ':attributeには異なった値を指定してね。',
    'email'                => ':attributeには、有効なメールアドレスを指定してね。',
    'ends_with'            => ':attributeには、:valuesのどれかで終わる値を指定してね。',
    'exists'               => '選択された:attributeは不正だよ。',
    'file'                 => ':attributeにはファイルを指定してね。',
    'filled'               => ':attributeに値を指定してね。',
    'gt'                   => [
        'numeric' => ':attributeには、:valueより大きな値を指定してね。',
        'file'    => ':attributeには、:value kBより大きなファイルを指定してね。',
        'string'  => ':attributeは、:value文字より長く指定してね。',
        'array'   => ':attributeには、:value個より多くのアイテムを指定してね。',
    ],
    'gte'                  => [
        'numeric' => ':attributeには、:value以上の値を指定してね。',
        'file'    => ':attributeには、:value kB以上のファイルを指定してね。',
        'string'  => ':attributeは、:value文字以上で指定してね。',
        'array'   => ':attributeには、:value個以上のアイテムを指定してね。',
    ],
    'image'                => ':attributeには画像ファイルを指定してね。',
    'in'                   => '選択された:attributeは不正だよ。',
    'in_array'             => ':attributeには:otherの値を指定してね。',
    'integer'              => ':attributeは整数で指定してね。',
    'ip'                   => ':attributeには、有効なIPアドレスを指定してね。',
    'ipv4'                 => ':attributeには、有効なIPv4アドレスを指定してね。',
    'ipv6'                 => ':attributeには、有効なIPv6アドレスを指定してね。',
    'json'                 => ':attributeには、有効なJSON文字列を指定してね。',
    'lt'                   => [
        'numeric' => ':attributeには、:valueより小さな値を指定してね。',
        'file'    => ':attributeには、:value kBより小さなファイルを指定してね。',
        'string'  => ':attributeは、:value文字より短く指定してね。',
        'array'   => ':attributeには、:value個より少ないアイテムを指定してね。',
    ],
    'lte'                  => [
        'numeric' => ':attributeには、:value以下の値を指定してね。',
        'file'    => ':attributeには、:value kB以下のファイルを指定してね。',
        'string'  => ':attributeは、:value文字以下で指定してね。',
        'array'   => ':attributeには、:value個以下のアイテムを指定してね。',
    ],
    'max'                  => [
        'numeric' => ':attributeには、:max以下の数字を指定してね。',
        'file'    => ':attributeには、:max kB以下のファイルを指定してね。',
        'string'  => ':attributeは、:max文字以下で指定してね。',
        'array'   => ':attributeは:max個以下指定してね。',
    ],
    'mimes'                => ':attributeには:valuesタイプのファイルを指定してね。',
    'mimetypes'            => ':attributeには:valuesタイプのファイルを指定してね。',
    'min'                  => [
        'numeric' => ':attributeには、:min以上の数字を指定してね。',
        'file'    => ':attributeには、:min kB以上のファイルを指定してね。',
        'string'  => ':attributeは、:min文字以上で指定してね。',
        'array'   => ':attributeは:min個以上指定してね。',
    ],
    'not_in'               => '選択された:attributeは不正だよ。',
    'not_regex'            => ':attributeの形式が不正だよ。',
    'numeric'              => ':attributeには、数字を指定してね。',
    'present'              => ':attributeが存在していません。',
    'regex'                => ':attributeに正しい形式を指定してね。',
    'required'             => ':attributeは必ず指定してね。',
    'required_if'          => ':otherが:valueの場合、:attributeも指定してね。',
    'required_unless'      => ':otherが:valuesでない場合、:attributeを指定してね。',
    'required_with'        => ':valuesを指定する場合は、:attributeも指定してね。',
    'required_with_all'    => ':valuesを指定する場合は、:attributeも指定してね。',
    'required_without'     => ':valuesを指定しない場合は、:attributeを指定してね。',
    'required_without_all' => ':valuesのどれも指定しない場合は、:attributeを指定してね。',
    'same'                 => ':attributeと:otherには同じ値を指定してね。',
    'size'                 => [
        'numeric' => ':attributeは:sizeを指定してね。',
        'file'    => ':attributeのファイルは、:sizeキロバイトにしてね。',
        'string'  => ':attributeは:size文字で指定してね。',
        'array'   => ':attributeは:size個指定してね。',
    ],
    'starts_with'          => ':attributeには、:valuesのどれかで始まる値を指定してね。',
    'string'               => ':attributeは文字列を指定してね。',
    'timezone'             => ':attributeには、有効なゾーンを指定してね。',
    'unique'               => ':attributeの値は既に存在しています。',
    'uploaded'             => ':attributeのアップロードに失敗しました。',
    'url'                  => ':attributeに正しい形式を指定してね。',
    'uuid'                 => ':attributeに有効なUUIDを指定してね。',
    'ulid'                 => ':attributeに有効なULIDを指定してね。',

    /*
    |--------------------------------------------------------------------------
    | Custom バリデーション言語行
    |--------------------------------------------------------------------------
    |
    | "属性.ルール"の規約でキーを指定することでカスタムバリデーション
    | メッセージを定義できます。指定した属性ルールに対する特定の
    | カスタム言語行を手早く指定できます。
    |
    */

    'custom' => [
        '属性名' => [
            'ルール名' => 'カスタムメッセージ',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | カスタムバリデーション属性名
    |--------------------------------------------------------------------------
    |
    | 以下の言語行は、例えば"email"の代わりに「メールアドレス」のように、
    | 読み手にフレンドリーな表現でプレースホルダーを置き換えるために指定する
    | 言語行です。これはメッセージをよりきれいに表示するために役に立ちます。
    |
    */

    'attributes' => [
    ],

];
