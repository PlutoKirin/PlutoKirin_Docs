# find_bad_file.py
import os
import codecs
import sys

def check_file_encoding(filepath):
    """检查文件是否能以UTF-8读取"""
    try:
        with open(filepath, 'rb') as f:
            raw_data = f.read()
        
        # 尝试UTF-8解码
        raw_data.decode('utf-8')
        return True, "UTF-8"
    except UnicodeDecodeError as e:
        # 尝试检测真实编码
        try:
            import chardet
            result = chardet.detect(raw_data)
            encoding = result['encoding']
            confidence = result['confidence']
            if encoding:
                # 尝试用检测到的编码读取
                decoded = raw_data.decode(encoding, errors='ignore')
                return False, f"{encoding} (置信度: {confidence:.2%}) - 位置: {e.start}"
        except:
            return False, f"非UTF-8 (错误位置: {e.start})"
    except Exception as e:
        return False, f"其他错误: {e}"
    
    return False, "未知编码"

def find_problematic_files(directory="."):
    """查找有编码问题的文件"""
    print("正在扫描Markdown文件编码...")
    print("=" * 60)
    
    problematic_files = []
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.md'):
                filepath = os.path.join(root, file)
                is_utf8, info = check_file_encoding(filepath)
                
                if not is_utf8:
                    problematic_files.append((filepath, info))
                    print(f"❌ {file}")
                    print(f"   路径: {filepath}")
                    print(f"   问题: {info}")
                    print()
    
    return problematic_files

def fix_file_encoding(filepath, target_encoding='utf-8'):
    """修复文件编码"""
    try:
        # 读取文件内容（尝试自动检测编码）
        with open(filepath, 'rb') as f:
            raw_data = f.read()
        
        # 尝试检测原始编码
        import chardet
        result = chardet.detect(raw_data)
        original_encoding = result['encoding'] if result['encoding'] else 'gbk'
        
        print(f"  检测到编码: {original_encoding} (置信度: {result['confidence']:.2%})")
        
        # 解码
        try:
            content = raw_data.decode(original_encoding)
        except:
            # 如果失败，尝试常见编码
            for enc in ['gbk', 'gb2312', 'gb18030', 'big5', 'latin-1']:
                try:
                    content = raw_data.decode(enc)
                    print(f"  使用备选编码: {enc}")
                    break
                except:
                    continue
            else:
                # 最后尝试忽略错误
                content = raw_data.decode('utf-8', errors='ignore')
                print(f"  使用UTF-8并忽略错误字符")
        
        # 保存为UTF-8
        with open(filepath, 'w', encoding=target_encoding, errors='ignore') as f:
            f.write(content)
        
        return True
    except Exception as e:
        print(f"  修复失败: {e}")
        return False

if __name__ == "__main__":
    # 安装chardet如果还没有
    try:
        import chardet
    except ImportError:
        print("正在安装chardet库...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "chardet"])
        import chardet
    
    # 查找有问题的文件
    bad_files = find_problematic_files()
    
    if bad_files:
        print(f"\n🔍 找到 {len(bad_files)} 个有编码问题的文件")
        print("=" * 60)
        
        # 显示有问题的文件
        for i, (filepath, info) in enumerate(bad_files, 1):
            print(f"{i}. {os.path.basename(filepath)}")
            print(f"   问题: {info}")
        
        # 询问是否修复
        print("\n" + "=" * 60)
        choice = input("是否自动修复这些文件？(y/N): ").strip().lower()
        
        if choice in ['y', 'yes', '是']:
            print("\n开始修复文件编码...")
            print("-" * 40)
            
            success_count = 0
            for filepath, info in bad_files:
                print(f"修复: {os.path.basename(filepath)}")
                if fix_file_encoding(filepath):
                    success_count += 1
                    print(f"  ✓ 修复成功")
                else:
                    print(f"  ✗ 修复失败")
                print()
            
            print(f"修复完成！成功: {success_count}/{len(bad_files)}")
            
            # 验证修复
            print("\n验证修复结果...")
            bad_files_after = find_problematic_files()
            if not bad_files_after:
                print("✅ 所有文件编码问题已修复！")
            else:
                print(f"⚠️  仍有 {len(bad_files_after)} 个文件有问题")
    else:
        print("✅ 没有发现编码问题的文件")
    
    print("\n" + "=" * 60)
    input("按 Enter 键退出...")